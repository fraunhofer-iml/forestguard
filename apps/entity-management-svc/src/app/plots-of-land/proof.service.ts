import { ProofCreateDto } from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import { FileStorageService } from '@forest-guard/file-storage';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Proof } from '@prisma/client';
import 'multer';
import { AmqpException } from '@forest-guard/amqp';

@Injectable()
export class ProofService {
  constructor(private readonly prismaService: PrismaService, private readonly fileStorageService: FileStorageService) {}

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

  async createProof(plotOfLandId: string, proofCreateDto: ProofCreateDto, file: Express.Multer.File): Promise<Proof> {
    await this.verifyUniquenessOfProof(plotOfLandId, proofCreateDto);
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
