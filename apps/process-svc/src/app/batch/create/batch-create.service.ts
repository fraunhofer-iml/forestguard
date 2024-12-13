import { AmqpException } from '@forest-guard/amqp';
import { BatchCombinedCreateDto, BatchCreateDto, ProcessStepIdResponse } from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Batch } from '@prisma/client';
import { mapBatchCombinedToBatchCreateDto } from '../utils/batch.mapper';
import { createBatchQuery, createOriginBatchQuery, processStepQuery, readBatchByIdQuery } from '../utils/batch.queries';

@Injectable()
export class BatchCreateService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly HARVESTING_PROCESS = 'Harvesting';
  private readonly MERGE_PROCESS = 'Merge';
  private readonly DEFAULT_LOCATION = 'Field';

  private readonly NO_CONTENT_MESSAGE = 'There is no input content to create';

  async createHarvests(batchCreateDtos: BatchCreateDto[]): Promise<ProcessStepIdResponse> {
    //  TODO: das für tests nutzen
    if (batchCreateDtos.length === 0) {
      throw new AmqpException(this.NO_CONTENT_MESSAGE, HttpStatus.NO_CONTENT);
    }

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
    if (batchCombinedCreateDto.processStep.harvestedLands.length === 0) {
      throw new AmqpException(this.NO_CONTENT_MESSAGE, HttpStatus.NO_CONTENT);
    }

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
    if (batchCreateDtos.length === 0) {
      throw new AmqpException(this.NO_CONTENT_MESSAGE, HttpStatus.NO_CONTENT);
    }

    const processStep = await this.prismaService.processStep.create({
      data: processStepQuery(batchCreateDtos[0].processStep),
    });

    for (const dto of batchCreateDtos) {
      await this.createBatch(dto, processStep.id);
    }

    return {
      processStepId: processStep.id,
    };
  }

  private calculateDividedWeight(batchCombinedCreateDto: BatchCombinedCreateDto) {
    if (batchCombinedCreateDto.processStep.harvestedLands.length === 0) {
      return 0;
    }
    return batchCombinedCreateDto.weight / batchCombinedCreateDto.processStep.harvestedLands.length;
  }

  private async createHarvest(dto: BatchCreateDto): Promise<Batch> {
    return this.prismaService.batch.create({
      data: createOriginBatchQuery(dto),
    });
  }

  private async mergeIntoOneHarvestBatch(batchCreateDto: BatchCreateDto, batches: Batch[]): Promise<Batch> {
    const mergeBatchCreateDto = structuredClone(batchCreateDto);
    mergeBatchCreateDto.ins = batches.map((batch) => batch.id);
    mergeBatchCreateDto.weight = batches.reduce((total, batch) => total + batch.weight, 0);
    mergeBatchCreateDto.processStep.process = this.MERGE_PROCESS;
    mergeBatchCreateDto.processStep.harvestedLand = undefined;
    return this.createBatch(mergeBatchCreateDto);
  }

  private async createBatch(dto: BatchCreateDto, existingProcessStepId?: string): Promise<Batch> {
    for(const batchId of dto.ins) {
      const fetchedBatch = await this.prismaService.batch.findUnique({where:  { id: batchId}});
      if(!(fetchedBatch)) {
        throw new AmqpException(`no batch with id ${batchId} found. `, HttpStatus.NOT_FOUND);
      }
      if(!(fetchedBatch.active)) {
        throw new AmqpException(`Batch '${batchId}' is already inactive. `, HttpStatus.BAD_REQUEST);
      }
    }
    const batch = await this.prismaService.batch.create({
      data: createBatchQuery(dto, existingProcessStepId),
    });
    await this.setBatchesInactive(dto);
    return batch;
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
}
