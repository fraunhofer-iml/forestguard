import { registerAs } from '@nestjs/config';

export const PROCESS_CONFIG_IDENTIFIER = 'process';

export interface ProcessSvcConfiguration {
  port: number;
  swaggerPath: string;
}

export default registerAs(PROCESS_CONFIG_IDENTIFIER, () => ({
  port: process.env['PROCESS_PORT'] || '3001',
  swaggerPath: process.env['SWAGGER_PATH'] || 'api',
}));
