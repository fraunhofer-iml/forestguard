/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Broker } from '@forest-guard/amqp';
import { Module } from '@nestjs/common';
import { CompanyModule } from '../company/company.module';
import { PlotOfLandController } from './plot-of-land.controller';
import { PlotOfLandService } from './plot-of-land.service';

@Module({
  imports: [new Broker().getEntityManagementBroker(), CompanyModule],
  controllers: [PlotOfLandController],
  providers: [PlotOfLandService],
})
export class PlotOfLandModule {}
