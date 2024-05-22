import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CultivationCreateDto, cultivation1Mock, CultivationDto } from '@forrest-guard/api-interfaces';

@ApiTags('Cultivations')
@Controller('cultivations')
export class CultivationController {

  @Post()
  @ApiOperation({ description: 'Create a cultivation' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createCultivation(@Body() cultivationCreateDto: CultivationCreateDto) : CultivationDto {
    return cultivation1Mock;
  }

  @Get()
  @ApiOperation({ description: 'Get all cultivations' })
  @ApiOkResponse({ description: 'Successful request.' })
  @ApiQuery( { name: 'type', required: false } )
  getCultivations(@Query('type') type?: string) : CultivationDto[] {
    return [cultivation1Mock];
  }

  @Get('types')
  @ApiOperation({ description: 'Get all cultivation types' })
  @ApiOkResponse({ description: 'Successful request.' })
  getCultivationTypes() : string[] {
    return ['coffee'];
  }
}
