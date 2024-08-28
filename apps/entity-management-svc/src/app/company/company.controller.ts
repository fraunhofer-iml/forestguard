import { CompanyMessagePatterns } from '@forest-guard/amqp';
import { CompanyCreateDto, CompanyDto } from '@forest-guard/api-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompanyService } from './company.service';

@Controller()
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @MessagePattern(CompanyMessagePatterns.CREATE)
  async createCompany(@Payload() payload: { dto: CompanyCreateDto; keycloakCompanyId: string }) {
    return await this.service.createCompany(payload.dto, payload.keycloakCompanyId);
  }

  @MessagePattern(CompanyMessagePatterns.READ_BY_ID)
  async readCompanyById(@Payload() payload: { id: string }): Promise<CompanyDto> {
    return await this.service.readCompanyById(payload.id);
  }

  @MessagePattern(CompanyMessagePatterns.READ_COMPANIES)
  async readCompanies(@Payload() payload: { filters: string; sorting: string }): Promise<CompanyDto[]> {
    return await this.service.readCompanies(payload.filters, payload.sorting);
  }
}
