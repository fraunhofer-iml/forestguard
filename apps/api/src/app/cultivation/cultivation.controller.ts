import { CultivationCreateDto, CultivationDto } from '@forrest-guard/api-interfaces';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CultivationService } from './cultivation.service';

@ApiTags('Cultivations')
@Controller('cultivations')
export class CultivationController {
  constructor(private readonly cultivationService: CultivationService) {}

  @Post()
  @ApiOperation({ description: 'Create a cultivation' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createCultivation(@Body() dto: CultivationCreateDto): Promise<CultivationDto> {
    return this.cultivationService.createCultivation(dto);
  }

  @Get()
  @ApiOperation({ description: 'Get all cultivations' })
  @ApiOkResponse({ description: 'Successful request.' })
  @ApiQuery({ name: 'type', required: true })
  getCultivationsByType(@Query('type') type: string): Promise<CultivationDto[]> {
    return this.cultivationService.readCultivationsByType(type);
  }

  @Get('types')
  @ApiOperation({ description: 'Get all cultivation types' })
  @ApiOkResponse({ description: 'Successful request.' })
  getCultivationTypes(): string[] {
    return ['coffee'];
  }
}
