import { BatchCreateDto, BatchDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Process } from '@prisma/client';
import { mapBatchPrismaToBatchDto } from './batch.mapper';
import { readCoffeeBatchesByCompanyIdQuery, createHarvestQuery, readBatchByIdQuery } from './batch.queries';

@Injectable()
export class BatchService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async createHarvests(batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    const harvestProcess: Process = await this.getHarvestProcess();
    for (const dto of batchCreateDtos) {
      await this.dbBatchCreate(dto, harvestProcess.id);
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

  private async getHarvestProcess() {
    return this.prismaService.process.findUnique({
      where: {
        name: 'Harvesting',
      },
    });
  }

  private async dbBatchCreate(batchCreateDto: BatchCreateDto, harvestProcessId: string) {
    try {
      await this.prismaService.batch.create({
        data: createHarvestQuery(batchCreateDto, harvestProcessId),
      });
    } catch (e) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: e.message,
      });
    }
  }

}
