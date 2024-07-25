import {
  BatchCombinedCreateDto,
  BatchCreateDto,
  BatchDto,
  BatchExportDto,
  BatchExportWrapperDto,
  Edge,
  ProcessDisplayDto,
} from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Batch, Prisma } from '@prisma/client';
import { BatchWithInAndOut } from './types/batch.types';
import {
  mapBatchCombinedToBatchCreateDto,
  mapBatchPrismaToBatchDto,
  mapBatchPrismaToBatchExportDto,
  mapBatchRelationToEdge,
  mapToProcessDisplayDto,
} from './utils/batch.mapper';
import {
  batchQuery,
  createBatchQuery,
  exportBatchIncludeQuery,
  readBatchByIdQuery,
  readBatchesByIdsQuery,
  readCoffeeBatchesByCompanyIdQuery,
} from './utils/batch.queries';

enum SearchDirection {
  PREVIOUS_BATCHES,
  NEXT_BATCHES,
}

@Injectable()
export class BatchService {
  constructor(private readonly prismaService: PrismaService) {}

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
      await this.mergeIntoOneHarvestBatch(batchCreateDtos[0], batches); // all batches are identical
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

  async getBatchById(id: string): Promise<BatchWithInAndOut> {
    return this.findRootBatchForExport(id);
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

  async exportBatch(id: string): Promise<BatchExportWrapperDto> {
    const rootResultBatch = await this.findRootBatchForExport(id);
    const inBatchIds = rootResultBatch.ins.map((batch) => batch.id);
    const outBatchIds = rootResultBatch.outs.map((batch) => batch.id);
    const rootBatch = mapBatchPrismaToBatchExportDto(rootResultBatch);
    await this.setInBatches(rootBatch, inBatchIds);
    await this.setOutBatches(rootBatch, outBatchIds);
    return new BatchExportWrapperDto(new Date().toISOString(), rootBatch);
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
    mergeBatchCreateDto.ins = batches.map((batch) => batch.id);
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
        id: { in: dto.ins },
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

  private findRootBatchForExport(id: string) {
    return this.prismaService.batch.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: exportBatchIncludeQuery(),
    });
  }

  private async setInBatches(rootBatch: BatchExportDto, inBatchIds: string[]) {
    let parentInBatches = [rootBatch];
    do {
      const nestedInBatches = await this.findNestedBatchesForExport(inBatchIds);
      for (const parentInBatch of parentInBatches) {
        this.addInBatches(parentInBatch, nestedInBatches);
      }
      parentInBatches = this.newInBatchesFrom(parentInBatches);
      inBatchIds = this.newInBatchIdsFrom(nestedInBatches);
    } while (inBatchIds.length !== 0);
  }

  private addInBatches(parentInBatch: BatchExportDto, inBatches: any[]) {
    const inBatchesWhichExistInParentBatch = inBatches.filter((batch) => batch.outs.map((batch) => batch.id).includes(parentInBatch.id));
    parentInBatch.ins = inBatchesWhichExistInParentBatch.map(mapBatchPrismaToBatchExportDto);
  }

  private newInBatchesFrom(parentInBatches: BatchExportDto[]) {
    return parentInBatches.flatMap((batch) => batch.ins);
  }

  private newInBatchIdsFrom(inBatches: any[]) {
    return inBatches.flatMap((batch) => batch.ins).map((batch) => batch.id);
  }

  private async setOutBatches(rootBatch: BatchExportDto, outBatchIds: string[]) {
    let parentOutBatches = [rootBatch];
    do {
      const nestedOutBatches = await this.findNestedBatchesForExport(outBatchIds);
      for (const parentOutBatch of parentOutBatches) {
        this.addOutBatches(parentOutBatch, nestedOutBatches);
      }
      parentOutBatches = this.newOutBatchesFrom(parentOutBatches);
      outBatchIds = this.newOutBatchIdsFrom(nestedOutBatches);
    } while (outBatchIds.length !== 0);
  }

  private addOutBatches(parentOutBatch: BatchExportDto, outBatches: any[]) {
    const outBatchesWhichExistInParentBatch = outBatches.filter((batch) => batch.ins.map((batch) => batch.id).includes(parentOutBatch.id));
    parentOutBatch.outs = outBatchesWhichExistInParentBatch.map(mapBatchPrismaToBatchExportDto);
  }

  private newOutBatchesFrom(parentOutBatches: BatchExportDto[]) {
    return parentOutBatches.flatMap((batch) => batch.outs);
  }

  private newOutBatchIdsFrom(outBatches: any[]) {
    return outBatches.flatMap((batch) => batch.outs).map((batch) => batch.id);
  }

  private findNestedBatchesForExport(batchIds: string[]) {
    return this.prismaService.batch.findMany({
      where: {
        id: { in: batchIds },
      },
      include: exportBatchIncludeQuery(),
    });
  }
}
