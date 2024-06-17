import { BatchCreateDto, BatchDto, ProcessDisplayDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Batch, BatchRelation } from '@prisma/client';
import { mapBatchPrismaToBatchDto, mapToProcessDisplayDto } from './batch.mapper';
import { batchQuery, createBatchQuery, readBatchByIdQuery, readCoffeeBatchesByCompanyIdQuery } from './batch.queries';

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
  constructor(private readonly prismaService: PrismaService) {}

  async createHarvests(batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    if (batchCreateDtos.length === 0) {
      return HttpStatus.NO_CONTENT;
    }
    const batches: Batch[] = [];
    for (const dto of batchCreateDtos) {
      dto.processStep.process = 'Harvesting';
      batches.push(await this.createHarvest(dto));
    }
    if (batchCreateDtos.length > 1) {
      await this.mergeIntoOneHarvestBatch(batchCreateDtos, batches);
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
    const allBatchRelations = previousBatchRelations.concat(forthcomingBatchRelations);

    const batches = await this.getCorrespondingBatches(previousBatchRelations.concat(allBatchRelations));
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

  private async createHarvest(dto: BatchCreateDto): Promise<Batch> {
    try {
      return await this.prismaService.batch.create({
        data: batchQuery(dto),
      });
    } catch (e) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: e.message,
      });
    }
  }

  private async mergeIntoOneHarvestBatch(batchCreateDtos: BatchCreateDto[], batches: Batch[]) {
    const mergeBatchCreateDto = structuredClone(batchCreateDtos[0]); // all batches are identical
    mergeBatchCreateDto.in = batches.map(batch => batch.id);
    mergeBatchCreateDto.weight = batches.reduce((total, batch) => total + batch.weight, 0);
    mergeBatchCreateDto.processStep.harvestedLand = undefined;
    await this.createBatch(mergeBatchCreateDto);
  }

  private async createBatch(dto: BatchCreateDto): Promise<Batch> {
    try {
      const batch = await this.prismaService.batch.create({
        data: createBatchQuery(dto),
      });
      await this.setBatchesInactive(dto);
      return batch;
    } catch (e) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: e.message,
      });
    }
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
    return this.prismaService.batch.findMany({
      where: {
        id: { in: batchIds },
      },
    });
  }
}
