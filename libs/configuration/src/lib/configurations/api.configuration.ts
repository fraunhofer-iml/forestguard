/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { registerAs } from '@nestjs/config';

export const API_CONFIG_IDENTIFIER = 'api';

export interface ApiConfiguration {
  port: number;
  swaggerPath: string;
}

export default registerAs(API_CONFIG_IDENTIFIER, () => ({
  port: process.env['API_PORT'] || '3000',
  swaggerPath: process.env['SWAGGER_PATH'] || 'api',
}));
