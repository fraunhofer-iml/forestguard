import { ProofCreateDto } from '@forrest-guard/api-interfaces';
import { PrismaService } from '@forrest-guard/database';
import { FileStorageService } from '@forrest-guard/file-storage';
import { Express } from 'express';
import { Injectable } from '@nestjs/common';
import { Proof } from '@prisma/client';
import 'multer';

@Injectable()
export class ProofService {
  constructor(private readonly prismaService: PrismaService, private readonly fileStorageService: FileStorageService) {}

  async createProof(plotOfLandId: string, proofCreateDto: ProofCreateDto, file: Express.Multer.File): Promise<Proof> {
    const id = crypto.randomUUID();
    const typeEnding = file.originalname.split('.').pop();
    const fileName = `${id}.${typeEnding}`;
    await this.fileStorageService.uploadFile(fileName, Buffer.from(file.buffer));

    return this.prismaService.proof.create({
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
    });
  }

  async readProofsByPlotOfLandId(plotOfLandId: string): Promise<Proof[]> {
    const proofs = await this.prismaService.proof.findMany({
      where: {
        plotOfLandId,
      },
    });

    return proofs.map((proof) => ({
      ...proof,
      documentRef: `${this.fileStorageService.fileStorageUrl}/${proof.documentRef}`,
    }));
  }
}
