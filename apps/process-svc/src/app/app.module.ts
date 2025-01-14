/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfigurationModule } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { Module } from '@nestjs/common';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [ConfigurationModule, BatchModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
