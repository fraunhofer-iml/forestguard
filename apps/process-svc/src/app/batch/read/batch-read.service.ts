import { BatchDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { Injectable } from '@nestjs/common';
import { mapBatchPrismaToBatchDto } from '../utils/batch.mapper';
import { readBatchByIdQuery, readCoffeeBatchesByCompanyIdQuery } from '../utils/batch.queries';


@Injectable()
export class BatchReadService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async readBatchById(id: string): Promise<BatchDto> {
    const batch = await this.prismaService.batch.findUniqueOrThrow(readBatchByIdQuery(id));
    return mapBatchPrismaToBatchDto(batch);
  }

  async readBatchesByCompanyId(companyId: string, query: string, sorting: string): Promise<BatchDto[]> {
    const batches = await this.prismaService.batch.findMany(readCoffeeBatchesByCompanyIdQuery(companyId, query, sorting));
    return batches.map(mapBatchPrismaToBatchDto);
  }
}
