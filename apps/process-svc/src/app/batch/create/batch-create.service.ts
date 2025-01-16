/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AmqpException } from '@forest-guard/amqp';
import {
  BatchCombinedCreateDto,
  BatchCreateDto,
  ProcessStepIdResponse,
  ProcessStepWithMultipleHarvestedLandsCreateDto,
} from '@forest-guard/api-interfaces';
import { BlockchainConnectorService } from '@forest-guard/blockchain-connector';
import { PrismaService } from '@forest-guard/database';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Batch } from '@prisma/client';
import { mapBatchCombinedToBatchCreateDto } from '../utils/batch.mapper';
import { createBatchQuery, createOriginBatchQuery, processStepQuery } from '../utils/batch.queries';

@Injectable()
export class BatchCreateService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly blockchainConnectorService: BlockchainConnectorService
  ) {}

  private readonly HARVESTING_PROCESS = 'Harvesting';
  private readonly MERGE_PROCESS = 'Merge';
  private readonly DEFAULT_LOCATION = 'Field';

  private readonly NO_CONTENT_MESSAGE = 'There is no input content to create';
  private readonly INVALID_PLOTSOFLAND_MESSAGE = (plotOfLandIds: string[], processOwner: string): string =>
    `The included PlotOfLand IDs [${plotOfLandIds}] do not exist or do not all belong to the process owner (${processOwner})`;

  async createHarvests(batchCreateDtos: BatchCreateDto[]): Promise<ProcessStepIdResponse> {
    this.hasContentForProcessing(batchCreateDtos);

    const batches: Batch[] = [];
    for (const dto of batchCreateDtos) {
      dto.processStep.process = this.HARVESTING_PROCESS;
      dto.processStep.location = dto.processStep.location || this.DEFAULT_LOCATION;
      batches.push(await this.createHarvest(dto));
    }
    let processStepId = batches[0].processStepId;

    if (batchCreateDtos.length > 1) {
      const mergedHarvestBatch = await this.mergeIntoOneHarvestBatch(batchCreateDtos[0], batches); // all batches are identical
      processStepId = mergedHarvestBatch.processStepId;
    }

    return {
      processStepId: processStepId,
    };
  }

  async createCombinedHarvests(batchCombinedCreateDto: BatchCombinedCreateDto): Promise<ProcessStepIdResponse> {
    this.hasContentForProcessing(batchCombinedCreateDto.processStep.harvestedLands);
    await this.checkPlotsOfLand(batchCombinedCreateDto.processStep);

    const dividedWeight = this.calculateDividedWeight(batchCombinedCreateDto);
    const batches: Batch[] = [];
    for (const harvestedLand of batchCombinedCreateDto.processStep.harvestedLands) {
      const batchCreateDto = mapBatchCombinedToBatchCreateDto(batchCombinedCreateDto);
      batchCreateDto.weight = dividedWeight;
      batchCreateDto.processStep.process = this.HARVESTING_PROCESS;
      batchCreateDto.processStep.location = batchCreateDto.processStep.location || this.DEFAULT_LOCATION;
      batchCreateDto.processStep.harvestedLand = harvestedLand;
      const harvestBatch = await this.createHarvest(batchCreateDto);
      batches.push(harvestBatch);
    }
    let processStepId = batches[0].processStepId;

    if (batchCombinedCreateDto.processStep.harvestedLands.length > 1) {
      const mergedHarvestBatch = await this.mergeIntoOneHarvestBatch(mapBatchCombinedToBatchCreateDto(batchCombinedCreateDto), batches);
      processStepId = mergedHarvestBatch.processStepId;
    }

    return {
      processStepId: processStepId,
    };
  }

  async createBatches(batchCreateDtos: BatchCreateDto[]): Promise<ProcessStepIdResponse> {
    this.hasContentForProcessing(batchCreateDtos);
    const processStep = await this.prismaService.processStep.create({
      data: processStepQuery(batchCreateDtos[0].processStep),
    });
    for (const currentBatch of batchCreateDtos) {
      for (const currentInBatchId of currentBatch.ins) {
        await this.ensureBatchIsActive(currentInBatchId);
      }
    }
    for (const dto of batchCreateDtos) {
      await this.createBatch(dto, processStep.id);
    }

    return {
      processStepId: processStep.id,
    };
  }

  private hasContentForProcessing(content: unknown[]) {
    if (content.length === 0) {
      throw new AmqpException(this.NO_CONTENT_MESSAGE, HttpStatus.NO_CONTENT);
    }
  }

  private async checkPlotsOfLand(processStep: ProcessStepWithMultipleHarvestedLandsCreateDto) {
    const harvestedLandIds = this.removeDuplicates(processStep.harvestedLands);
    const numberOfPlotOfLandMatches = await this.prismaService.plotOfLand.count({
      where: {
        id: { in: harvestedLandIds },
        farmerId: processStep.executedBy,
      },
    });
    if (numberOfPlotOfLandMatches !== harvestedLandIds.length) {
      throw new AmqpException(this.INVALID_PLOTSOFLAND_MESSAGE(harvestedLandIds, processStep.executedBy), HttpStatus.BAD_REQUEST);
    }
  }

  private removeDuplicates(list: string[]) {
    return Array.from(new Set(list));
  }

  private calculateDividedWeight(batchCombinedCreateDto: BatchCombinedCreateDto) {
    if (batchCombinedCreateDto.processStep.harvestedLands.length === 0) {
      return 0;
    }
    return batchCombinedCreateDto.weight / batchCombinedCreateDto.processStep.harvestedLands.length;
  }

  private async createHarvest(dto: BatchCreateDto): Promise<Batch> {
    const createdBatch = await this.prismaService.batch.create({
      data: createOriginBatchQuery(dto),
      include: {
        processStep: {
          include: {
            farmedLand: true,
          },
        },
      },
    });

    const plotOfLandId = createdBatch.processStep.farmedLand.id;
    await this.blockchainConnectorService.mintBatchRootNft({ ...createdBatch, plotOfLandId });
    return createdBatch;
  }

  private async mergeIntoOneHarvestBatch(batchCreateDto: BatchCreateDto, batches: Batch[]): Promise<Batch> {
    for (const currentBatch of batches) {
      await this.ensureBatchIsActive(currentBatch.id);
    }

    const mergeBatchCreateDto = structuredClone(batchCreateDto);
    mergeBatchCreateDto.ins = batches.map((batch) => batch.id);
    mergeBatchCreateDto.weight = batches.reduce((total, batch) => total + batch.weight, 0);
    mergeBatchCreateDto.processStep.process = this.MERGE_PROCESS;
    mergeBatchCreateDto.processStep.harvestedLand = undefined;
    return this.createBatch(mergeBatchCreateDto);
  }

  private async createBatch(dto: BatchCreateDto, existingProcessStepId?: string): Promise<Batch> {
    const createdBatch = await this.prismaService.batch.create({
      data: createBatchQuery(dto, existingProcessStepId),
      include: { ins: true },
    });

    const parentIds = createdBatch.ins.map((ins) => ins.id);
    await this.blockchainConnectorService.mintBatchLeafNft({ ...createdBatch, parentIds });
    await this.setBatchesInactive(dto);
    return createdBatch;
  }

  private setBatchesInactive(dto: BatchCreateDto) {
    return this.prismaService.batch.updateMany({
      where: {
        id: { in: dto.ins },
      },
      data: {
        active: false,
      },
    });
  }
  
  private async ensureBatchIsActive(batchId: string) {
    const fetchedBatch = await this.prismaService.batch.findUnique({ where: { id: batchId } });

    if (!fetchedBatch) {
      throw new AmqpException(`No batch with id ${batchId} found. `, HttpStatus.NOT_FOUND);
    }
    if (!fetchedBatch.active) {
      throw new AmqpException(`Batch '${fetchedBatch.id}' is already inactive. `, HttpStatus.BAD_REQUEST);
    }
  }
}