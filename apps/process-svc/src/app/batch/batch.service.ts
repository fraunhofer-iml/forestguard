import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@forrest-guard/database';
import {
  BatchCombinedCreateDto,
  BatchCreateDto,
  BatchDto,
  Edge,
  ProcessDisplayDto,
} from '@forrest-guard/api-interfaces';
import { Batch, Prisma } from '@prisma/client';
import {
  mapBatchCombinedToBatchCreateDto,
  mapBatchPrismaToBatchDto,
  mapBatchRelationToEdge,
  mapToProcessDisplayDto,
} from './batch.mapper';
import {
  batchQuery,
  createBatchQuery,
  readBatchByIdQuery,
  readBatchesByIdsQuery,
  readCoffeeBatchesByCompanyIdQuery,
} from './batch.queries';

enum SearchDirection {
  PREVIOUS_BATCHES,
  NEXT_BATCHES,
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
    const nextBatchRelations = await this.getBatchRelations(id, SearchDirection.NEXT_BATCHES);
    const allBatchRelations = [...previousBatchRelations, ...nextBatchRelations];

    const batches = await this.getCorrespondingBatches(allBatchRelations);
    return mapToProcessDisplayDto(allBatchRelations, batches);
  }

  private async getBatchRelations(id: string, searchDirection: SearchDirection): Promise<Edge[]> {
    const batchRelations: Edge[] = [];
    let nextLevelBatchRelations: Edge[];
    let nextLevelBatchIds = [id];
    do {
      nextLevelBatchRelations = await this.getDirectBatchRelations(nextLevelBatchIds, searchDirection);
      nextLevelBatchIds = nextLevelBatchRelations.map(this.batchRelationToIdMapper(searchDirection));
      batchRelations.push(...nextLevelBatchRelations);
    } while (nextLevelBatchIds.length !== 0);
    return batchRelations;
  }

  private async getDirectBatchRelations(batchIds: string[], searchDirection: SearchDirection): Promise<Edge[]> {
    const batchRelations: Edge[] = [];
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

  private async findBatchRelations(id: string, searchDirection: SearchDirection): Promise<Edge[]> {
    const edges = await this.prismaService.$queryRaw<never[]>(this.buildRelationSql(id, searchDirection));
    return edges.map(mapBatchRelationToEdge);
  }

  private buildRelationSql(id: string, searchDirection: SearchDirection): Prisma.Sql {
    switch (searchDirection) {
      case SearchDirection.PREVIOUS_BATCHES:
        return Prisma.sql`SELECT *
                          FROM "_BatchRelation"
                          where "A" = ${id}`;
      case SearchDirection.NEXT_BATCHES:
        return Prisma.sql`SELECT *
                          FROM "_BatchRelation"
                          where "B" = ${id}`;
    }
  }

  private batchRelationToIdMapper(searchDirection: SearchDirection) {
    switch (searchDirection) {
      case SearchDirection.PREVIOUS_BATCHES:
        return ({ from }) => from;
      case SearchDirection.NEXT_BATCHES:
        return ({ to }) => to;
    }
  }

  private getCorrespondingBatches(batchRelations: Edge[]) {
    const batchIds = batchRelations.flatMap(({ from, to }) => [from, to]);
    return this.prismaService.batch.findMany(readBatchesByIdsQuery(batchIds));
  }
}
