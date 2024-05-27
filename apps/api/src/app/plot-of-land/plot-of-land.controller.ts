import { PlotOfLandCreateDto, PlotOfLandDto, PlotOfLandUpdateDto, proof1Mock, ProofDto } from '@forrest-guard/api-interfaces';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PlotOfLandService } from './plot-of-land.service';

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

  @Get(':polId/proofs')
  @ApiOperation({ description: 'Get all proofs of a plot of land' })
  @ApiOkResponse({ description: 'Successful request.' })
  getProofs(@Param('polId') polId: string): ProofDto[] {
    return [proof1Mock];
  }

  @Post(':polId/proofs')
  @ApiOperation({ description: 'Create a proof for a plot of land' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createProofs(@Param('polId') polId: string, @Body() proofDto: ProofDto): ProofDto {
    return proof1Mock;
  }
}
