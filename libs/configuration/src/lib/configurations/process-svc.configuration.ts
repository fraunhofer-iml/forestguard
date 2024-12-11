import { registerAs } from '@nestjs/config';

export const PROCESS_CONFIG_IDENTIFIER = 'process';

export interface ProcessSvcConfiguration {
  swaggerPath: string;
}

export default registerAs(PROCESS_CONFIG_IDENTIFIER, () => ({
  swaggerPath: process.env['SWAGGER_PATH'] || 'api',
}));
