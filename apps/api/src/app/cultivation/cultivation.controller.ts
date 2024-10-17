import { CultivationCreateDto, CultivationDto } from '@forest-guard/api-interfaces';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CultivationService } from './cultivation.service';

@ApiTags('Cultivations')
@Controller('cultivations')
export class CultivationController {
  constructor(private readonly cultivationService: CultivationService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create a cultivation' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createCultivation(@Body() dto: CultivationCreateDto): Promise<CultivationDto> {
    return this.cultivationService.createCultivation(dto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all cultivations' })
  @ApiOkResponse({ description: 'Successful request.' })
  @ApiQuery({ name: 'commodity', required: true })
  getCultivationsByCommodity(@Query('commodity') commodity: string): Promise<CultivationDto[]> {
    return this.cultivationService.readCultivationsByCommodity(commodity);
  }

  @Get('commodities')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get all cultivation commodities' })
  @ApiOkResponse({ description: 'Successful request.' })
  getCultivationCommodities(): string[] {
    return ['coffee'];
  }
}
