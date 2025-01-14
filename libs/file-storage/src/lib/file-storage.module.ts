/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfigurationModule, ConfigurationService } from '@forest-guard/configuration';
import { NestMinioModule, NestMinioOptions } from 'nestjs-minio';
import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';

@Module({
  imports: [
    ConfigurationModule,
    NestMinioModule.registerAsync({
      imports: [ConfigurationModule],
      useFactory: async (configService: ConfigurationService): Promise<NestMinioOptions> => {
        const generalConfiguration = configService.getGeneralConfiguration();

        if (!generalConfiguration) {
          throw new Error('GeneralConfiguration is not defined.');
        }

        return {
          endPoint: generalConfiguration.minio.endPoint,
          port: generalConfiguration.minio.port,
          useSSL: generalConfiguration.minio.useSSL,
          accessKey: generalConfiguration.minio.accessKey,
          secretKey: generalConfiguration.minio.secretKey,
        };
      },
      inject: [ConfigurationService],
    }),
  ],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
