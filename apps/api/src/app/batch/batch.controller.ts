import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  batch1Mock,
  BatchCreateDto,
  BatchDto,
  process1Mock,
  processDisplay1Mock,
  ProcessDisplayDto,
  ProcessDto,
} from '@forrest-guard/api-interfaces';
import { BatchService } from './batch.service';

@ApiTags('Batches')
@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @ApiOperation({ description: 'Create coffee batches' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createBatches(@Body() batchCreateDtos: BatchCreateDto[]): ProcessDto {
    return process1Mock;
  }

  @Post('harvests')
  @ApiOperation({ description: 'Create harvest batches' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createHarvests(@Body() batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    return this.batchService.createHarvests(batchCreateDtos);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get coffee batch by ID' })
  @ApiOkResponse({ description: 'Successful request.' })
  getBatch(@Param('id') id: string): BatchDto {
    return batch1Mock;
  }

  @Get(':id/related')
  @ApiOperation({ description: 'Get all coffee batches that are related to the coffee batch' })
  @ApiOkResponse({ description: 'Successful request.' })
  getRelatedBatches(@Param('id') id: string): ProcessDisplayDto {
    return processDisplay1Mock;
  }
}
