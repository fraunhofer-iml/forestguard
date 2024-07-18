import { BatchCombinedCreateDto, BatchCreateDto, BatchDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Batch } from '@prisma/client';
import { mapBatchCombinedToBatchCreateDto, mapBatchPrismaToBatchDto } from './utils/batch.mapper';
import {
  batchQuery,
  createBatchQuery,
  getBatchByIdQuery,
  readBatchByIdQuery,
  readCoffeeBatchesByCompanyIdQuery,
} from './utils/batch.queries';

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

  async getBatchById(id: string): Promise<Batch & { in: Batch[]; out: Batch[] }> {
    return this.prismaService.batch.findUniqueOrThrow(getBatchByIdQuery(id));
  }

  async readBatchById(id: string): Promise<BatchDto> {
    const batch = await this.prismaService.batch.findUniqueOrThrow(readBatchByIdQuery(id));
    return mapBatchPrismaToBatchDto(batch);
  }

  async readBatchesByCompanyId(companyId: string): Promise<BatchDto[]> {
    const batches = await this.prismaService.batch.findMany(readCoffeeBatchesByCompanyIdQuery(companyId));
    return batches.map(mapBatchPrismaToBatchDto);
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
    mergeBatchCreateDto.in = batches.map((batch) => batch.id);
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
}
