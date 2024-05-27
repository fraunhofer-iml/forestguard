import { CompanyMessagePatterns } from '@forrest-guard/amqp';
import { CompanyDto } from '@forrest-guard/api-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompanyService } from './company.service';

@Controller()
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @MessagePattern(CompanyMessagePatterns.READ_BY_ID)
  async readCompanyById(@Payload() payload: { id: string }): Promise<CompanyDto> {
    return await this.service.readCompanyById(payload.id);
  }
}
