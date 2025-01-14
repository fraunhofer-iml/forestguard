/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Broker } from '@forest-guard/amqp';
import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';

@Module({
  imports: [new Broker().getEntityManagementBroker()],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
