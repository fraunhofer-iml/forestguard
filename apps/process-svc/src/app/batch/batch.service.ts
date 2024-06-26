import { BatchCombinedCreateDto, BatchCreateDto, BatchDto, ProcessDisplayDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Batch, BatchRelation } from '@prisma/client';
import { mapBatchCombinedToBatchCreateDto, mapBatchPrismaToBatchDto, mapToProcessDisplayDto } from './batch.mapper';
import {
  batchQuery,
  createBatchQuery,
  readBatchByIdQuery,
  readBatchesByIdsQuery,
  readCoffeeBatchesByCompanyIdQuery,
} from './batch.queries';

enum SearchDirection {
  PREVIOUS_BATCHES,
  FORTHCOMING_BATCHES,
}

function batchRelationToIdMapper(searchDirection: SearchDirection) {
  switch (searchDirection) {
    case SearchDirection.PREVIOUS_BATCHES:
      return ({ inId }) => inId;
    case SearchDirection.FORTHCOMING_BATCHES:
      return ({ outId }) => outId;
  }
}

function filterProperty(id: string, searchDirection: SearchDirection) {
  switch (searchDirection) {
    case SearchDirection.PREVIOUS_BATCHES:
      return {
        outId: id,
      };
    case SearchDirection.FORTHCOMING_BATCHES:
      return {
        inId: id,
      };
  }
}

@Injectable()
export class BatchService {
  constructor(private readonly prismaService: PrismaService) {
  }

  private HARVESTING_PROCESS = 'Harvesting';
  private MERGE_PROCESS = 'Merge';

  async createHarvests(batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    if (batchCreateDtos.length === 0) {
      return HttpStatus.NO_CONTENT;
    }
    const batches: Batch[] = [];
    for (const dto of batchCreateDtos) {
      dto.processStep.process = this.HARVESTING_PROCESS;
      batches.push(await this.createHarvest(dto));
    }
    if (batchCreateDtos.length > 1) {
      await this.mergeIntoOneHarvestBatch(batchCreateDtos[0], batches);  // all batches are identical
    }
    return HttpStatus.CREATED;
  }

  async createCombinedHarvests(batchCombinedCreateDto: BatchCombinedCreateDto): Promise<HttpStatus> {
    if (batchCombinedCreateDto.processStep.harvestedLands.length === 0) {
      return HttpStatus.NO_CONTENT;
    }
    const dividedWeight = this.calculateDividedWeight(batchCombinedCreateDto);
    const batches: Batch[] = [];
    for (const harvestedLand of batchCombinedCreateDto.processStep.harvestedLands) {
      const batchCreateDto = mapBatchCombinedToBatchCreateDto(batchCombinedCreateDto);
      batchCreateDto.weight = dividedWeight;
      batchCreateDto.processStep.process = this.HARVESTING_PROCESS;
      batchCreateDto.processStep.harvestedLand = harvestedLand;
      batches.push(await this.createHarvest(batchCreateDto));
    }
    if (batchCombinedCreateDto.processStep.harvestedLands.length > 1) {
      await this.mergeIntoOneHarvestBatch(mapBatchCombinedToBatchCreateDto(batchCombinedCreateDto), batches);
    }
    return HttpStatus.CREATED;
  }

  async createBatches(batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    if (batchCreateDtos.length === 0) {
      return HttpStatus.NO_CONTENT;
    }
    for (const dto of batchCreateDtos) {
      await this.createBatch(dto);
    }
    return HttpStatus.CREATED;
  }

  async readBatchById(id: string): Promise<BatchDto> {
    const batch = await this.prismaService.batch.findUniqueOrThrow(readBatchByIdQuery(id));
    return mapBatchPrismaToBatchDto(batch);
  }

  async readBatchesByCompanyId(companyId: string): Promise<BatchDto[]> {
    const batches = await this.prismaService.batch.findMany(readCoffeeBatchesByCompanyIdQuery(companyId));
    return batches.map(mapBatchPrismaToBatchDto);
  }

  async readRelatedBatchesById(id: string): Promise<ProcessDisplayDto> {
    const previousBatchRelations = await this.getBatchRelations(id, SearchDirection.PREVIOUS_BATCHES);
    const forthcomingBatchRelations = await this.getBatchRelations(id, SearchDirection.FORTHCOMING_BATCHES);
    const allBatchRelations = [...previousBatchRelations, ...forthcomingBatchRelations];

    const batches = await this.getCorrespondingBatches(allBatchRelations);
    return mapToProcessDisplayDto(allBatchRelations, batches);
  }

  private async getBatchRelations(id: string, searchDirection: SearchDirection): Promise<BatchRelation[]> {
    const batchRelations: BatchRelation[] = [];
    let nextLevelBatchRelations: BatchRelation[];
    let nextLevelBatchIds = [id];
    let batchRelationsLength: number;
    do {
      batchRelationsLength = batchRelations.length;
      nextLevelBatchRelations = await this.getDirectBatchRelations(nextLevelBatchIds, searchDirection);
      nextLevelBatchIds = nextLevelBatchRelations.map(batchRelationToIdMapper(searchDirection));
      batchRelations.push(...nextLevelBatchRelations);
    } while (batchRelations.length > batchRelationsLength);
    return batchRelations;
  }

  private async getDirectBatchRelations(batchIds: string[], searchDirection: SearchDirection): Promise<BatchRelation[]> {
    const batchRelations: BatchRelation[] = [];
    for (const batchId of batchIds) {
      batchRelations.push(...(await this.findBatchRelations(batchId, searchDirection)));
    }
    return batchRelations;
  }

  private calculateDividedWeight(batchCombinedCreateDto: BatchCombinedCreateDto) {
    if (batchCombinedCreateDto.processStep.harvestedLands.length === 0) {
      return 0;
    }
    return Math.floor(batchCombinedCreateDto.weight / batchCombinedCreateDto.processStep.harvestedLands.length);
  }

  private async createHarvest(dto: BatchCreateDto): Promise<Batch> {
    return this.prismaService.batch.create({
      data: batchQuery(dto),
    });
  }

  private async mergeIntoOneHarvestBatch(batchCreateDto: BatchCreateDto, batches: Batch[]) {
    const mergeBatchCreateDto = structuredClone(batchCreateDto);
    mergeBatchCreateDto.in = batches.map(batch => batch.id);
    mergeBatchCreateDto.weight = batches.reduce((total, batch) => total + batch.weight, 0);
    mergeBatchCreateDto.processStep.process = this.MERGE_PROCESS;
    mergeBatchCreateDto.processStep.harvestedLand = undefined;
    await this.createBatch(mergeBatchCreateDto);
  }

  private async createBatch(dto: BatchCreateDto): Promise<Batch> {
    const batch = await this.prismaService.batch.create({
      data: createBatchQuery(dto),
    });
    await this.setBatchesInactive(dto);
    return batch;
  }

  private setBatchesInactive(dto: BatchCreateDto) {
    return this.prismaService.batch.updateMany({
      where: {
        id: { in: dto.in },
      },
      data: {
        active: false,
      },
    });
  }

  private findBatchRelations(id: string, searchDirection: SearchDirection) {
    return this.prismaService.batchRelation.findMany({
      where: filterProperty(id, searchDirection),
    });
  }

  private getCorrespondingBatches(batchRelations: BatchRelation[]) {
    const batchIds = batchRelations.flatMap(({ inId, outId }) => [inId, outId]);
    return this.prismaService.batch.findMany(readBatchesByIdsQuery(batchIds));
  }
}
