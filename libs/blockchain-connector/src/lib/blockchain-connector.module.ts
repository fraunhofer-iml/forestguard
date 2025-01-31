/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConfigurationModule } from '@forest-guard/configuration';
import { FileStorageModule } from '@forest-guard/file-storage';
import { DataIntegrityModule, TokenModule } from 'nft-folder-blockchain-connector';
import { Module } from '@nestjs/common';
import { BatchNftService } from './batch-nft.service';
import { BlockchainConnectorService } from './blockchain-connector.service';
import { PlotOfLandNftService } from './plot-of-land-nft.service';

@Module({
  imports: [ConfigurationModule, DataIntegrityModule, FileStorageModule, TokenModule],
  providers: [BatchNftService, BlockchainConnectorService, PlotOfLandNftService],
  exports: [BlockchainConnectorService],
})
export class BlockchainConnectorModule {}
