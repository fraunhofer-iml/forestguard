import { registerAs } from '@nestjs/config';

export const ENTITY_MANAGEMENT_CONFIG_IDENTIFIER = 'entity-management';

export interface EntityManagementSvcConfiguration {
  port: number;
  swaggerPath: string;
  cultivationType: string;
}

export default registerAs(ENTITY_MANAGEMENT_CONFIG_IDENTIFIER, () => ({
  port: process.env['ENTITY_MANAGEMENT_PORT'] || '3002',
  swaggerPath: process.env['SWAGGER_PATH'] || 'api',
  cultivationType: process.env['CULTIVATION_TYPE'] || 'coffee',
}));
