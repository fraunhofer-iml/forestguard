import { Body, Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Document } from '@prisma/client';
import { ProcessStepService } from './process-step.service';

@ApiTags('Process Steps')
@Controller('process-steps')
export class ProcessStepController {
  constructor(private readonly processStepService: ProcessStepService) {}

  @Post(':id/docs')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Create a document for process steps' })
  @ApiBody({
    description: 'A description of the document',
    type: String,
  })
  @ApiConsumes('multipart/form-data')
  addDocToProcessStep(
    @Body() { description }: { description: string },
    @UploadedFile() file: Express.Multer.File,
    @Param('id') processStepId: string
  ): Promise<Document> {
    return this.processStepService.addDocToProcessStep({ file, processStepId, description });
  }
}
