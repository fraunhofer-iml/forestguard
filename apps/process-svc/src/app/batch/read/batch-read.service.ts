import { BatchDto } from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import { Injectable } from '@nestjs/common';
import { mapBatchPrismaToBatchDto } from '../utils/batch.mapper';
import { readBatchByIdQuery, readCoffeeBatchesByCompanyIdQuery } from '../utils/batch.queries';

@Injectable()
export class BatchReadService {
  constructor(private readonly prismaService: PrismaService) {}

  async readBatchById(id: string): Promise<BatchDto> {
    const batch = await this.prismaService.batch.findUniqueOrThrow(readBatchByIdQuery(id));
    return mapBatchPrismaToBatchDto(batch);
  }

  async readBatchesByCompanyId(companyId: string, query: string, sorting: string): Promise<BatchDto[]> {
    const batches = await this.prismaService.batch.findMany(readCoffeeBatchesByCompanyIdQuery(companyId, query, sorting));
    const batchDtos = batches.map(mapBatchPrismaToBatchDto);
    for (const batch of batchDtos) {
      batch.hasAllProofs = await this.getStatusOfBatch(batch.id);
      console.log(batch.hasAllProofs);
    }
    return batchDtos;
  }

  async getStatusOfBatch(batchId: string): Promise<boolean> {
    const batch = await this.prismaService.batch.findUniqueOrThrow(readBatchByIdQuery(batchId));

    if (batch.processStep.farmedLand) {
      return batch.processStep.farmedLand.proofs?.length === 2;
    }

    if (!batch.processStep.farmedLand && batch.ins.length > 0) {
      return batch.ins.every((previousBatch) => this.getStatusOfBatch(previousBatch.id));
    }

    return false;
  }
}
