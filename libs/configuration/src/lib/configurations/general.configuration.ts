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

import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export const GENERAL_CONFIG_IDENTIFIER = 'general';

export interface GeneralConfiguration {
  logLevel: LogLevel[];
  swaggerPath: string;
  amqpUri: string;
  blockchainEnabled: boolean;
  minio: {
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
    bucketName: string;
  };
}

export default registerAs(GENERAL_CONFIG_IDENTIFIER, () => ({
  logLevel: (process.env['LOG_SETTINGS'] || 'error,verbose').split(','),
  swaggerPath: process.env['SWAGGER_PATH'] || 'api',
  amqpUri: process.env['AMQP_URI'] || 'amqp://localhost:5672',
  blockchainEnabled: process.env['BLOCKCHAIN_ENABLED'] === 'true',
  minio: {
    endPoint: process.env['MINIO_ENDPOINT'] || 'localhost',
    port: parseInt(process.env['MINIO_PORT'] || '9000'),
    useSSL: process.env['MINIO_USE_SSL'] === 'true',
    accessKey: process.env['MINIO_ACCESS_KEY'] || 'admin',
    secretKey: process.env['MINIO_SECRET_KEY'] || 'blockchain',
    bucketName: process.env['MINIO_BUCKET_NAME'] || 'forest-guard',
  },
}));
