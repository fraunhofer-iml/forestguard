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

import { BlockchainConnectorModule } from '@forest-guard/blockchain-connector';
import { PrismaService } from '@forest-guard/database';
import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchCreateService } from './create/batch-create.service';
import { BatchExportService } from './export/batch-export.service';
import { BatchReadService } from './read/batch-read.service';
import { BatchReadRelatedService } from './related/batch-read-related.service';

@Module({
  imports: [BlockchainConnectorModule],
  controllers: [BatchController],
  providers: [BatchCreateService, BatchReadService, BatchReadRelatedService, BatchExportService, PrismaService],
})
export class BatchModule {}
