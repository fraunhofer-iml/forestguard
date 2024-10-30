import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImportService } from './import.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { ImportResponseDto, TAuthenticatedUser } from '@forest-guard/api-interfaces';

@ApiTags('Import')
@Controller('import')
export class ImportController {
  constructor(private importService: ImportService) {
  }

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ description: 'Import master data from an excel file' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file with master data',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  importMasterData(@UploadedFile() file: Express.Multer.File, @AuthenticatedUser() user: TAuthenticatedUser): Promise<ImportResponseDto> {
    return this.importService.importMasterData(file, user.sub);
  }
}
