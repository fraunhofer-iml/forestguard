import { PlotOfLandCreateDto, PlotOfLandDto, PlotOfLandUpdateDto, ProofCreateDto, ProofDto } from '@forrest-guard/api-interfaces';
import { Express } from 'express';
import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlotOfLandService } from './plot-of-land.service';
import { ProofUploadDto } from './proof-upload.dto';
import 'multer';

@ApiTags('PlotOfLands')
@Controller('pols')
export class PlotOfLandController {
  constructor(private plotOfLandService: PlotOfLandService) {}

  @Get()
  @ApiOperation({ description: 'Get all plot of lands of a farmer' })
  @ApiOkResponse({ description: 'Successful request.' })
  getPlotsOfLand(@Query('farmerId') farmerId?: string): Promise<PlotOfLandDto[]> {
    return this.plotOfLandService.readPlotsOfLand(farmerId);
  }

  @Post()
  @ApiOperation({ description: 'Create a plot of land for a farmer' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createPlotOfLand(@Query('farmerId') farmerId: string, @Body() plotOfLandCreateDto: PlotOfLandCreateDto): Promise<PlotOfLandDto> {
    return this.plotOfLandService.createPlotOfLand(plotOfLandCreateDto, farmerId);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get plot of land by ID' })
  @ApiOkResponse({ description: 'Successful request.' })
  getPlotOfLandById(@Param('id') id: string): Promise<PlotOfLandDto> {
    return this.plotOfLandService.readPlotOfLandById(id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Create or update the seeding for a plot of land' })
  @ApiOkResponse({ description: 'Successful creation.' })
  createOrUpdatePlotOfLand(@Param('id') id: string, @Body() plotOfLandUpdateDto: PlotOfLandUpdateDto): Promise<PlotOfLandDto> {
    return this.plotOfLandService.updatePlotOfLand(plotOfLandUpdateDto, id);
  }

  @Post(':id/proofs')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Create a proof for a plot of land' })
  @ApiBody({
    description: 'The proof of the given plot of land. Either of type `PROOF_OF_FREEDOM` of `PROOF_OF_OWNERSHIP`.',
    type: ProofUploadDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'Successful creation.' })
  postProof(@Param('id') plotOfLandId: string, @Body() dto: ProofCreateDto, @UploadedFile() file: Express.Multer.File): Promise<ProofDto> {
    return this.plotOfLandService.createProof(plotOfLandId, dto, file);
  }

  @Get(':id/proofs')
  @ApiOperation({ description: 'Get all proofs of a plot of land' })
  @ApiOkResponse({ description: 'Successful request.' })
  getProofsByPlotOfLandId(@Param('id') id: string): Promise<ProofDto[]> {
    return this.plotOfLandService.readProofsByPlotOfLandId(id);
  }
}
