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
