/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfigurationService } from '@forest-guard/configuration';
import { Client } from 'minio';
import { MINIO_CONNECTION } from 'nestjs-minio';
import { Inject, Injectable } from '@nestjs/common';
import 'multer';
import { randomUUID } from 'crypto';

@Injectable()
export class FileStorageService {
  public readonly fileStorageUrl;

  private readonly bucketName;

  constructor(@Inject(MINIO_CONNECTION) private readonly client: Client, private readonly configurationService: ConfigurationService) {
    const generalConfiguration = this.configurationService.getGeneralConfiguration();

    if (!generalConfiguration) {
      throw new Error('GeneralConfiguration is not defined.');
    }

    this.fileStorageUrl = `http://${generalConfiguration.minio.endPoint}:${generalConfiguration.minio.port}/${generalConfiguration.minio.bucketName}`;
    this.bucketName = generalConfiguration.minio.bucketName;
  }

  async uploadFileWithDeepPath(file: Express.Multer.File, entityPath: string, entityId: string) {
    const typeEnding = file.originalname.split('.').pop();
    const fileName = `${entityPath}/${entityId}/${randomUUID()}.${typeEnding}`;
    await this.uploadFile(fileName, Buffer.from(file.buffer));
    return fileName;
  }

  uploadFile(fileName: string, file: Buffer) {
    return this.client.putObject(this.bucketName, fileName, file);
  }

  downloadFile(fileName: string) {
    return this.client.getObject(this.bucketName, fileName);
  }

  deleteFile(fileName: string) {
    return this.client.removeObject(this.bucketName, fileName);
  }
}
