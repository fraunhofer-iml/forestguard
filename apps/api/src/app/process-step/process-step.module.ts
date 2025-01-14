/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Broker } from '@forest-guard/amqp';
import { Module } from '@nestjs/common';
import { ProcessStepController } from './process-step.controller';
import { ProcessStepService } from './process-step.service';

@Module({
  imports: [new Broker().getEntityManagementBroker()],
  controllers: [ProcessStepController],
  providers: [ProcessStepService],
})
export class ProcessStepModule {}
