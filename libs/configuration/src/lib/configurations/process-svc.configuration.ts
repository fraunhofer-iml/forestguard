/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { registerAs } from '@nestjs/config';

export const PROCESS_CONFIG_IDENTIFIER = 'process';

export interface ProcessSvcConfiguration {
  swaggerPath: string;
}

export default registerAs(PROCESS_CONFIG_IDENTIFIER, () => ({
  swaggerPath: process.env['SWAGGER_PATH'] || 'api',
}));
