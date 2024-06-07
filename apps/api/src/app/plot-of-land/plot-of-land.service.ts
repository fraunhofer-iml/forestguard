import { AmqpClientEnum, PlotOfLandMessagePatterns } from '@forrest-guard/amqp';
import { PlotOfLandCreateDto, PlotOfLandDto, PlotOfLandUpdateDto, ProofCreateDto, ProofDto } from '@forrest-guard/api-interfaces';
import { Express } from 'express';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import 'multer';

@Injectable()
export class PlotOfLandService {
  constructor(@Inject(AmqpClientEnum.QUEUE_ENTITY_MANAGEMENT) private readonly entityManagementService: ClientProxy) {}

  readPlotOfLandById(id: string): Promise<PlotOfLandDto> {
    return firstValueFrom(this.entityManagementService.send(PlotOfLandMessagePatterns.READ_BY_ID, { id }));
  }

  readPlotsOfLand(farmerId?: string): Promise<PlotOfLandDto[]> {
    return firstValueFrom(this.entityManagementService.send(PlotOfLandMessagePatterns.READ_ALL, { farmerId }));
  }

  createPlotOfLand(plotOfLand: PlotOfLandCreateDto, farmerId: string): Promise<PlotOfLandDto> {
    return firstValueFrom(this.entityManagementService.send(PlotOfLandMessagePatterns.CREATE, { plotOfLand, farmerId }));
  }

  updatePlotOfLand(plotOfLand: PlotOfLandUpdateDto, id: string): Promise<PlotOfLandDto> {
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
}
