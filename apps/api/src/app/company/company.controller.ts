import { BatchDto, CompanyCreateDto, CompanyDto, farmer1Mock, FarmerDto } from '@forrest-guard/api-interfaces';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';

@ApiTags('Companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiOperation({ description: 'Create a company' })
  @ApiCreatedResponse({ description: 'Successful creation.' })
  createCompany(@Body() dto: CompanyCreateDto): Promise<CompanyDto> {
    return this.companyService.createCompany(dto);
  }

  @Get(':id')
  @ApiOperation({ description: 'Get company by ID' })
  @ApiOkResponse({ description: 'Successful request.' })
  getCompany(@Param('id') id: string): Promise<CompanyDto> {
    return this.companyService.readCompany(id);
  }

  @Get(':id/batches')
  @ApiOperation({ description: 'Get all coffee batches of the company' })
  @ApiOkResponse({ description: 'Successful request.' })
  @ApiQuery({ name: 'query', required: false })
  getBatches(@Param('id') id: string, @Query('query') query?: string): Promise<BatchDto[]> {
    return this.companyService.readBatchesByCompanyId(id);
  }

  @Get(':id/farmers')
  @ApiOperation({ description: 'Get all farmers related to the company' })
  @ApiOkResponse({ description: 'Successful request.' })
  getFarmers(@Param('id') id: string): FarmerDto[] {
    return [farmer1Mock];
  }
}
