/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ConfigurationModule } from '@forest-guard/configuration';
import { FileStorageModule } from '@forest-guard/file-storage';
import { DataIntegrityModule, TokenModule } from '@nft-folder/blockchain-connector';
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
