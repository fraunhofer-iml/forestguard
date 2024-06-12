import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BatchCreateDto, BatchDto, processDisplay1Mock, ProcessDisplayDto } from '@forrest-guard/api-interfaces';
import { BatchService } from './batch.service';

@ApiTags('Batches')
@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {
  }

  @Post()
  @ApiOperation({ description: 'Create coffee batches' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createBatches(@Body() batchCreateDtos: BatchCreateDto[]): Promise<HttpStatus> {
    return this.batchService.createBatches((batchCreateDtos));
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
  getBatch(@Param('id') id: string): Promise<BatchDto> {
    return this.batchService.readBatch(id);
  }

  @Get(':id/related')
  @ApiOperation({ description: 'Get all coffee batches that are related to the coffee batch' })
  @ApiOkResponse({ description: 'Successful request.' })
  getRelatedBatches(@Param('id') id: string): ProcessDisplayDto {
    return processDisplay1Mock;
  }
}
