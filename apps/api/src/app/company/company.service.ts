import { AmqpClientEnum, CompanyMessagePatterns } from '@forrest-guard/amqp';
import { CompanyDto } from '@forrest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CompanyService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {}

  readCompany(id: string): Promise<CompanyDto> {
    return firstValueFrom(this.entityManagementService.send(CompanyMessagePatterns.READ_BY_ID, { id }));
  }
}
