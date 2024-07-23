import { Body, Controller, Get, Header, HttpStatus, Param, Post, StreamableFile } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BatchCombinedCreateDto, BatchCreateDto, BatchDto, ProcessDisplayDto } from '@forrest-guard/api-interfaces';
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

  @Post('harvests/combined')
  @ApiOperation({ description: 'Create harvest batches to multiple plot of lands' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createCombinedHarvests(@Body() batchCombinedCreateDto: BatchCombinedCreateDto): Promise<HttpStatus> {
    return this.batchService.createCombinedHarvests(batchCombinedCreateDto);
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
  getRelatedBatches(@Param('id') id: string): Promise<ProcessDisplayDto> {
    return this.batchService.getRelatedBatches(id);
  }

  @Get(':id/export')
  @ApiOperation({ description: 'Export batch file with all batch information and all previous and next batches' })
  @ApiOkResponse({ description: 'Successful request.' })
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="batches_export.json"')
  async getExportBatch(@Param('id') id: string): Promise<StreamableFile> {
    const exportJson = await this.batchService.readExportBatch(id);
    return new StreamableFile(Buffer.from(JSON.stringify(exportJson, null, 2)));
  }
}
