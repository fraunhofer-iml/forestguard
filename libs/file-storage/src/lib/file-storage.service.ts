import { ConfigurationService } from '@forrest-guard/configuration';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FileStorageService {
  private readonly bucketName;

  constructor(@Inject(MINIO_CONNECTION) private readonly client: Client, private readonly configurationService: ConfigurationService) {
    const generalConfiguration = this.configurationService.getGeneralConfiguration();

    if (!generalConfiguration) {
      throw new Error('GeneralConfiguration is not defined.');
    }

    this.bucketName = generalConfiguration.minio.bucketName;
  }

  uploadFile(fileName: string, file: Buffer) {
    return this.client.putObject(this.bucketName, fileName, file);
  }

  downloadFile(fileName: string) {
    return this.client.getObject(this.bucketName, fileName);
  }
}
