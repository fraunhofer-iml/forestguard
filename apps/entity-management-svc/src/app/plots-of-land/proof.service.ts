/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProofCreateDto, ProofDto } from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import { FileStorageService } from '@forest-guard/file-storage';
import { HttpStatus, Injectable } from '@nestjs/common';
import 'multer';
import { AmqpException } from '@forest-guard/amqp';
import { BlockchainConnectorService } from '@forest-guard/blockchain-connector';

@Injectable()
export class ProofService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileStorageService: FileStorageService,
    private readonly blockchainConnectorService: BlockchainConnectorService
  ) {}

  private async verifyUniquenessOfProof(plotOfLandId: string, proofCreateDto: ProofCreateDto): Promise<void> {
    const numberOfProofs = await this.prismaService.proof.count({
      where: {
        type: proofCreateDto.type,
        plotOfLandId: plotOfLandId,
      },
    });

    if (numberOfProofs > 0) {
      throw new AmqpException(`Proof already exists.`, HttpStatus.CONFLICT);
    }
  }

  async createProof(plotOfLandId: string, proofCreateDto: ProofCreateDto, file: Express.Multer.File): Promise<ProofDto> {
    await this.verifyUniquenessOfProof(plotOfLandId, proofCreateDto);
    const fileName = await this.fileStorageService.uploadFileWithDeepPath(file, 'plot-of-land', plotOfLandId);

    const createdProof = await this.prismaService.proof.create({
      data: {
        type: proofCreateDto.type,
        documentRef: fileName,
        notice: null,
        plotOfLand: {
          connect: {
            id: plotOfLandId,
          },
        },
      },
      include: {
        plotOfLand: true,
      },
    });

    await this.blockchainConnectorService.updatePlotOfLandNft(createdProof);

    return createdProof;
  }

  async readProofsByPlotOfLandId(plotOfLandId: string): Promise<ProofDto[]> {
    return this.prismaService.proof.findMany({
      where: {
        plotOfLandId,
      },
    });
  }
}
