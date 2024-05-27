import { PlotOfLandMessagePatterns } from '@forrest-guard/amqp';
import { PlotOfLandCreateDto, PlotOfLandUpdateDto } from '@forrest-guard/api-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlotOfLand } from '@prisma/client';
import { PlotsOfLandService } from './plots-of-land.service';

@Controller()
export class PlotsOfLandController {
  constructor(private plotsOfLandService: PlotsOfLandService) {}

  @MessagePattern(PlotOfLandMessagePatterns.CREATE)
  async createPlotOfLand(@Payload() payload: { plotOfLand: PlotOfLandCreateDto; farmerId: string }): Promise<PlotOfLand> {
    return this.plotsOfLandService.createPlotOfLand(payload.plotOfLand, payload.farmerId);
  }

  @MessagePattern(PlotOfLandMessagePatterns.READ_ALL)
  async readPlotsOfLand(@Payload() payload: { farmerId: string | undefined }): Promise<PlotOfLand[]> {
    return this.plotsOfLandService.readPlotsOfLand(payload.farmerId);
  }

  @MessagePattern(PlotOfLandMessagePatterns.READ_BY_ID)
  async readPlotOfLandById(@Payload() payload: { id: string }): Promise<PlotOfLand[]> {
    return this.plotsOfLandService.readPlotsOfLand(payload.id);
  }

  @MessagePattern(PlotOfLandMessagePatterns.UPDATE_BY_ID)
  async updatePlotOfLand(@Payload() payload: { id: string; plotOfLand: PlotOfLandUpdateDto }): Promise<PlotOfLand> {
    return this.plotsOfLandService.updatePlotOfLand(payload.id, payload.plotOfLand);
  }
}
