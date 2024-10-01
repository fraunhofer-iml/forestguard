import { BatchCombinedCreateDto, BatchCreateDto, BatchDto, ProcessDisplayDto, ProcessStepIdResponse, TAuthenticatedUser } from '@forest-guard/api-interfaces';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { Body, Controller, Get, Header, Param, Post, StreamableFile } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BatchService } from './batch.service';

@ApiTags('Batches')
@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create coffee batches' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createBatches(@Body() batchCreateDtos: BatchCreateDto[], @AuthenticatedUser() user: TAuthenticatedUser): Promise<ProcessStepIdResponse> {
    return this.batchService.createBatches({ batchCreateDtos, companyId: user.sub });
  }

  @Post('harvests')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create harvest batches' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  async createHarvests(@Body() batchCreateDtos: BatchCreateDto[], @AuthenticatedUser() user: TAuthenticatedUser): Promise<ProcessStepIdResponse> {
    return this.batchService.createHarvests({ batchCreateDtos, companyId: user.sub });
  }

  @Post('harvests/combined')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create harvest batches to multiple plot of lands' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  async createCombinedHarvests(@Body() batchCombinedCreateDto: BatchCombinedCreateDto, @AuthenticatedUser() user: TAuthenticatedUser): Promise<ProcessStepIdResponse> {
    return this.batchService.createCombinedHarvests({ batchCombinedCreateDto, companyId: user.sub });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get coffee batch by ID' })
  @ApiOkResponse({ description: 'Successful request.' })
  getBatch(@Param('id') id: string): Promise<BatchDto> {
    return this.batchService.readBatch(id);
  }

  @Get(':id/related')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all coffee batches that are related to the coffee batch' })
  @ApiOkResponse({ description: 'Successful request.' })
  getRelatedBatches(@Param('id') id: string): Promise<ProcessDisplayDto> {
    return this.batchService.getRelatedBatches(id);
  }

  @Get(':id/export')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Export batch file with all batch information and all previous and next batches' })
  @ApiOkResponse({ description: 'Successful request.' })
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="batches_export.json"')
  async getExportBatch(@Param('id') id: string): Promise<StreamableFile> {
    const exportJson = await this.batchService.readExportBatch(id);
    return new StreamableFile(Buffer.from(JSON.stringify(exportJson, null, 2)));
  }
}
