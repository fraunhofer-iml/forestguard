import { BatchCreateDto, BatchDto, ProcessStepCreateDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Prisma, Process } from '@prisma/client';
import { mapBatchPrismaToBatchDto } from './batch.mapper';
import { readCoffeeBatchesByCompanyIdQuery } from './batch.queries';

@Injectable()
export class BatchService {
  constructor(private readonly prismaService: PrismaService) {}

  async createHarvests(batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    const harvestProcess: Process = await this.getHarvestProcess();
    for (const dto of batchCreateDtos) {
      await this.dbBatchCreate(dto, harvestProcess.id);
    }
    return HttpStatus.CREATED;
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
        data: this.toBatchQuery(batchCreateDto, harvestProcessId),
      });
    } catch (e) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: e.message,
      });
    }
  }

  private toBatchQuery(batchCreateDto: BatchCreateDto, harvestProcessId: string): Prisma.BatchCreateInput {
    return {
      euInfoSystemId: batchCreateDto.idEUInfoSystem,
      weight: batchCreateDto.weight,
      active: true,
      recipient: {
        connect: {
          id: batchCreateDto.recipient,
        },
      },
      processStep: {
        create: this.toProcessStepQuery(batchCreateDto.processStep, harvestProcessId),
      },
    };
  }

  private toProcessStepQuery(processStepCreateDto: ProcessStepCreateDto, harvestProcessId: string): Prisma.ProcessStepCreateInput {
    return {
      location: processStepCreateDto.location,
      date: processStepCreateDto.date,
      process: {
        connect: {
          id: harvestProcessId,
        },
      },
      recordedBy: {
        connect: {
          id: processStepCreateDto.recordedBy,
        },
      },
      executedBy: {
        connect: {
          id: processStepCreateDto.executedBy,
        },
      },
      farmedLand: {
        connect: {
          id: processStepCreateDto.harvestedLand,
        },
      },
    };
  }
}
