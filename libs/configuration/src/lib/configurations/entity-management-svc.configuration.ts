import { registerAs } from '@nestjs/config';

export const ENTITY_MANAGEMENT_CONFIG_IDENTIFIER = 'entity-management';

export interface EntityManagementSvcConfiguration {
  swaggerPath: string;
  cultivationCommodity: string;
}

export default registerAs(ENTITY_MANAGEMENT_CONFIG_IDENTIFIER, () => ({
  swaggerPath: process.env['SWAGGER_PATH'] || 'api',
  cultivationCommodity: process.env['CULTIVATION_COMMODITY'] || 'coffee',
}));
