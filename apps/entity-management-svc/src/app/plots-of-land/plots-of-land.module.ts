/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockchainConnectorModule } from '@forest-guard/blockchain-connector';
import { ConfigurationModule } from '@forest-guard/configuration';
import { PrismaService } from '@forest-guard/database';
import { FileStorageModule } from '@forest-guard/file-storage';
import { Module } from '@nestjs/common';
import { PlotsOfLandController } from './plots-of-land.controller';
import { PlotsOfLandService } from './plots-of-land.service';
import { ProofService } from './proof.service';

@Module({
  imports: [BlockchainConnectorModule, ConfigurationModule, FileStorageModule],
  providers: [PlotsOfLandService, ProofService, PrismaService],
  controllers: [PlotsOfLandController],
  exports: [PlotsOfLandService],
})
export class PlotsOfLandModule {}
