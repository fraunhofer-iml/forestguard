import { CultivationMessagePatterns } from '@forest-guard/amqp';
import { CultivationCreateDto, CultivationDto } from '@forest-guard/api-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CultivationService } from './cultivation.service';

@Controller()
export class CultivationController {
  constructor(private cultivationService: CultivationService) {}

  @MessagePattern(CultivationMessagePatterns.CREATE)
  async createCultivation(@Payload() payload: { dto: CultivationCreateDto }): Promise<CultivationDto> {
    return this.cultivationService.createCultivation(payload.dto);
  }

  @MessagePattern(CultivationMessagePatterns.READ_ALL_BY_COMMODITY)
  async readCultivationByCommodity(@Payload() payload: { commodity: string }): Promise<CultivationDto[]> {
    return this.cultivationService.readCultivationsByCommodity(payload.commodity);
  }
}
