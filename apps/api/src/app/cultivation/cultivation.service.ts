import { AmqpClientEnum, CultivationMessagePatterns } from '@forest-guard/amqp';
import { CultivationCreateDto, CultivationDto } from '@forest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CultivationService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {}

  createCultivation(dto: CultivationCreateDto): Promise<CultivationDto> {
    return firstValueFrom(this.entityManagementService.send(CultivationMessagePatterns.CREATE, { dto }));
  }

  readCultivationsByCommodity(commodity: string): Promise<CultivationDto[]> {
    return firstValueFrom(this.entityManagementService.send(CultivationMessagePatterns.READ_ALL_BY_COMMODITY, { commodity }));
  }
}
