import { AmqpClientEnum, CultivationMessagePatterns } from '@forrest-guard/amqp';
import { CultivationCreateDto, CultivationDto } from '@forrest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CultivationService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {}

  createCultivation(dto: CultivationCreateDto): Promise<CultivationDto> {
    return firstValueFrom(this.entityManagementService.send(CultivationMessagePatterns.CREATE, { dto }));
  }

  readCultivationsByType(type: string): Promise<CultivationDto[]> {
    return firstValueFrom(this.entityManagementService.send(CultivationMessagePatterns.READ_ALL_BY_TYPE, { type }));
  }
}
