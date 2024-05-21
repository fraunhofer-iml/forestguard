import { registerAs } from '@nestjs/config';

export const ENTITY_MANAGEMENT_CONFIG_IDENTIFIER = 'api';

export interface EntityManagementSvcConfiguration {
  port: number;
  swaggerPath: string;
}

export default registerAs(ENTITY_MANAGEMENT_CONFIG_IDENTIFIER, () => ({
  port: process.env['EM_PORT'] || '3002',
  swaggerPath: process.env['SWAGGER_PATH'] || 'api',
}));
