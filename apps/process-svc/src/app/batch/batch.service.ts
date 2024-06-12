import { BatchCreateDto, BatchDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { mapBatchPrismaToBatchDto } from './batch.mapper';
import { batchQuery, createBatchQuery, readBatchByIdQuery, readCoffeeBatchesByCompanyIdQuery } from './batch.queries';

@Injectable()
export class BatchService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async createHarvests(batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    for (const dto of batchCreateDtos) {
      dto.processStep.process = 'Harvesting';
      await this.createHarvest(dto);
    }
    return HttpStatus.CREATED;
  }

  async createBatches(batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
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

  private async createHarvest(dto: BatchCreateDto) {
    try {
      await this.prismaService.batch.create({
        data: batchQuery(dto),
      });
    } catch (e) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: e.message,
      });
    }
  }

  private async createBatch(dto: BatchCreateDto) {
    try {
      await this.prismaService.batch.create({
        data: createBatchQuery(dto),
      });
      await this.setBatchesInactive(dto);
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

}
