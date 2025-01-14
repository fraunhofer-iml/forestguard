/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

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
