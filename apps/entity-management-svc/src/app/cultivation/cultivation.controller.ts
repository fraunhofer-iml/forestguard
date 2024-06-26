import { CultivationMessagePatterns } from '@forrest-guard/amqp';
import { CultivationDto } from '@forrest-guard/api-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CultivationService } from './cultivation.service';

@Controller()
export class CultivationController {
  constructor(private cultivationService: CultivationService) {}

  @MessagePattern(CultivationMessagePatterns.READ_ALL_BY_TYPE)
  async readCultivationByType(@Payload() payload: { type: string }): Promise<CultivationDto[]> {
    return this.cultivationService.readCultivationsByType(payload.type);
  }
}
