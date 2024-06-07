import { PlotOfLandMessagePatterns } from '@forrest-guard/amqp';
import { PlotOfLandCreateDto, PlotOfLandUpdateDto, ProofCreateDto } from '@forrest-guard/api-interfaces';
import { Express } from 'express';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlotOfLand, Proof } from '@prisma/client';
import { PlotsOfLandService } from './plots-of-land.service';
import { ProofService } from './proof.service';
import 'multer';

@Controller()
export class PlotsOfLandController {
  constructor(private plotsOfLandService: PlotsOfLandService, private proofService: ProofService) {}

  @MessagePattern(PlotOfLandMessagePatterns.CREATE)
  async createPlotOfLand(@Payload() payload: { plotOfLand: PlotOfLandCreateDto; farmerId: string }): Promise<PlotOfLand> {
    return this.plotsOfLandService.createPlotOfLand(payload.plotOfLand, payload.farmerId);
  }

  @MessagePattern(PlotOfLandMessagePatterns.READ_ALL)
  async readPlotsOfLand(@Payload() payload: { farmerId: string | undefined }): Promise<PlotOfLand[]> {
    return this.plotsOfLandService.readPlotsOfLand(payload.farmerId);
  }

  @MessagePattern(PlotOfLandMessagePatterns.READ_BY_ID)
  async readPlotOfLandById(@Payload() payload: { id: string }): Promise<PlotOfLand> {
    return this.plotsOfLandService.readPlotOfLandById(payload.id);
  }

  @MessagePattern(PlotOfLandMessagePatterns.UPDATE_BY_ID)
  async updatePlotOfLand(@Payload() payload: { id: string; plotOfLand: PlotOfLandUpdateDto }): Promise<PlotOfLand> {
    return this.plotsOfLandService.updatePlotOfLand(payload.id, payload.plotOfLand);
  }

  @MessagePattern(PlotOfLandMessagePatterns.CREATE_BY_ID_PROOF)
  async createProof(
    @Payload() payload: { plotOfLandId: string; proofCreateDto: ProofCreateDto; file: Express.Multer.File }
  ): Promise<Proof> {
    return this.proofService.createProof(payload.plotOfLandId, payload.proofCreateDto, payload.file);
  }

  @MessagePattern(PlotOfLandMessagePatterns.READ_BY_ID_PROOFS)
  async readProofsByPlotOfLandId(@Payload() payload: { plotOfLandId: string }): Promise<Proof[]> {
    return this.proofService.readProofsByPlotOfLandId(payload.plotOfLandId);
  }
}
