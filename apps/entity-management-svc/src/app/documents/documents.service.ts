import { PrismaService } from '@forest-guard/database';
import { FileStorageService } from '@forest-guard/file-storage';
import { Injectable } from '@nestjs/common';
import { Document } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(private readonly prismaService: PrismaService, private readonly fileStorageService: FileStorageService) {}

  async addDocumentToProcessStep({
    file,
    processStepId,
    description,
  }: {
    file: Express.Multer.File;
    processStepId: string;
    description: string;
  }): Promise<Document> {
    const id = crypto.randomUUID();
    const typeEnding = file.originalname.split('.').pop();
    const fileName = `process-step/${id}.${typeEnding}`;
    await this.fileStorageService.uploadFile(fileName, Buffer.from(file.buffer));

    return await this.prismaService.document.create({
      data: {
        description: description,
        documentRef: fileName,
        processStep: {
          connect: {
            id: processStepId,
          },
        },
      },
    });
  }
}
