/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
