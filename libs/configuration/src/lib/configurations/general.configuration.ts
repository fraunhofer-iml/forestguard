import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export const GENERAL_CONFIG_IDENTIFIER = 'general';

export interface GeneralConfiguration {
  logLevel: LogLevel[];
  swaggerPath: string;
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
  minio: {
    endPoint: process.env['MINIO_ENDPOINT'] || 'localhost',
    port: parseInt(process.env['MINIO_PORT'] || '9000'),
    useSSL: process.env['MINIO_USE_SSL'] === 'true',
    accessKey: process.env['MINIO_ACCESS_KEY'] || 'admin',
    secretKey: process.env['MINIO_SECRET_KEY'] || 'blockchain',
    bucketName: process.env['MINIO_BUCKET_NAME'] || 'forest-guard',
  },
}));
