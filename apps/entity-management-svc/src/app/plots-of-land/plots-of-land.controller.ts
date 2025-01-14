/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlotOfLandMessagePatterns } from '@forest-guard/amqp';
import { PlotOfLandCreateDto, PlotOfLandDto, PlotOfLandUpdateDto, ProofCreateDto, ProofDto } from '@forest-guard/api-interfaces';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlotsOfLandService } from './plots-of-land.service';
import { ProofService } from './proof.service';
import 'multer';

@Controller()
export class PlotsOfLandController {
  constructor(private plotsOfLandService: PlotsOfLandService, private proofService: ProofService) {}

  @MessagePattern(PlotOfLandMessagePatterns.CREATE)
  async createPlotOfLand(@Payload() payload: { plotOfLand: PlotOfLandCreateDto; farmerId: string }): Promise<PlotOfLandDto> {
    return this.plotsOfLandService.createPlotOfLand(payload.plotOfLand, payload.farmerId);
  }

  @MessagePattern(PlotOfLandMessagePatterns.READ_ALL)
  async readPlotsOfLand(@Payload() payload: { farmerId: string | undefined }): Promise<PlotOfLandDto[]> {
    return this.plotsOfLandService.readPlotsOfLand(payload.farmerId);
  }

  @MessagePattern(PlotOfLandMessagePatterns.READ_BY_ID)
  async readPlotOfLandById(@Payload() payload: { id: string }): Promise<PlotOfLandDto> {
    return this.plotsOfLandService.readPlotOfLandById(payload.id);
  }

  @MessagePattern(PlotOfLandMessagePatterns.UPDATE_BY_ID)
  async updatePlotOfLand(@Payload() payload: { id: string; plotOfLand: PlotOfLandUpdateDto }): Promise<PlotOfLandDto> {
    return this.plotsOfLandService.updatePlotOfLand(payload.id, payload.plotOfLand);
  }

  @MessagePattern(PlotOfLandMessagePatterns.CREATE_BY_ID_PROOF)
  async createProof(
    @Payload() payload: { plotOfLandId: string; proofCreateDto: ProofCreateDto; file: Express.Multer.File }
  ): Promise<ProofDto> {
    return this.proofService.createProof(payload.plotOfLandId, payload.proofCreateDto, payload.file);
  }

  @MessagePattern(PlotOfLandMessagePatterns.READ_BY_ID_PROOFS)
  async readProofsByPlotOfLandId(@Payload() payload: { plotOfLandId: string }): Promise<ProofDto[]> {
    return this.proofService.readProofsByPlotOfLandId(payload.plotOfLandId);
  }
}
