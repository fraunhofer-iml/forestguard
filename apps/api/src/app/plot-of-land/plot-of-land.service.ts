/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AmqpClientEnum, PlotOfLandMessagePatterns } from '@forest-guard/amqp';
import { PlotOfLandCreateDto, PlotOfLandDto, PlotOfLandUpdateDto, ProofCreateDto, ProofDto } from '@forest-guard/api-interfaces';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import 'multer';
import { CompanyService } from '../company/company.service';

@Injectable()
export class PlotOfLandService {
  constructor(
    @Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy,
    private companyService: CompanyService
  ) {}

  readPlotOfLandById(id: string): Promise<PlotOfLandDto> {
    return firstValueFrom(this.entityManagementService.send(PlotOfLandMessagePatterns.READ_BY_ID, { id }));
  }

  readPlotsOfLand(farmerId?: string): Promise<PlotOfLandDto[]> {
    return firstValueFrom(this.entityManagementService.send(PlotOfLandMessagePatterns.READ_ALL, { farmerId }));
  }

  async createPlotOfLand({
    farmerId,
    plotOfLand,
    companyId,
  }: {
    plotOfLand: PlotOfLandCreateDto;
    farmerId: string;
    companyId: string;
  }): Promise<PlotOfLandDto> {
    await this.checkIfFarmerIsPartOfCompany(farmerId, companyId);

    return firstValueFrom(this.entityManagementService.send(PlotOfLandMessagePatterns.CREATE, { plotOfLand, farmerId }));
  }

  async updatePlotOfLand({ id, plotOfLand }: { plotOfLand: PlotOfLandUpdateDto; id: string }): Promise<PlotOfLandDto> {
    return firstValueFrom(this.entityManagementService.send(PlotOfLandMessagePatterns.UPDATE_BY_ID, { plotOfLand, id }));
  }

  createProof(plotOfLandId: string, proofCreateDto: ProofCreateDto, file: Express.Multer.File): Promise<ProofDto> {
    return firstValueFrom(
      this.entityManagementService.send(PlotOfLandMessagePatterns.CREATE_BY_ID_PROOF, { plotOfLandId, proofCreateDto, file })
    );
  }

  readProofsByPlotOfLandId(plotOfLandId: string): Promise<ProofDto[]> {
    return firstValueFrom(this.entityManagementService.send(PlotOfLandMessagePatterns.READ_BY_ID_PROOFS, { plotOfLandId }));
  }

  private async checkIfFarmerIsPartOfCompany(farmerId: string, companyId: string): Promise<void> {
    const company = await this.companyService.readCompany(companyId);

    if (!company) {
      throw new UnauthorizedException();
    }

    if (!company.farmers.find((c) => c.id === farmerId)) {
      throw new UnauthorizedException();
    }
  }
}
