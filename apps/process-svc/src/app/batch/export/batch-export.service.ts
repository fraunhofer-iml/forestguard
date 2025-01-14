/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchExportDto, BatchExportWrapperDto } from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import { Injectable } from '@nestjs/common';
import { mapBatchPrismaToBatchExportDto } from '../utils/batch.mapper';
import { readBatchByIdQuery, readBatchIncludeQuery } from '../utils/batch.queries';

@Injectable()
export class BatchExportService {
  constructor(private readonly prismaService: PrismaService) {}

  async exportBatch(id: string): Promise<BatchExportWrapperDto> {
    const rootResultBatch = await this.findRootBatchForExport(id);
    const inBatchIds = rootResultBatch.ins.map((batch) => batch.id);
    const outBatchIds = rootResultBatch.outs.map((batch) => batch.id);
    const rootBatch = mapBatchPrismaToBatchExportDto(rootResultBatch);
    await this.setInBatches(rootBatch, inBatchIds);
    await this.setOutBatches(rootBatch, outBatchIds);
    return new BatchExportWrapperDto(new Date().toISOString(), rootBatch);
  }

  private findRootBatchForExport(id: string) {
    return this.prismaService.batch.findUniqueOrThrow(readBatchByIdQuery(id));
  }

  private async setInBatches(rootBatch: BatchExportDto, inBatchIds: string[]) {
    let parentInBatches = [rootBatch];
    do {
      const nestedInBatches = await this.findNestedBatchesForExport(inBatchIds);
      for (const parentInBatch of parentInBatches) {
        this.addInBatches(parentInBatch, nestedInBatches);
      }
      parentInBatches = this.newInBatchesFrom(parentInBatches);
      inBatchIds = this.newInBatchIdsFrom(nestedInBatches);
    } while (inBatchIds.length !== 0);
  }

  private addInBatches(parentInBatch: BatchExportDto, inBatches: any[]) {
    const inBatchesWhichExistInParentBatch = inBatches.filter((batch) => batch.outs.map((batch) => batch.id).includes(parentInBatch.id));
    parentInBatch.ins = inBatchesWhichExistInParentBatch.map(mapBatchPrismaToBatchExportDto);
  }

  private newInBatchesFrom(parentInBatches: BatchExportDto[]) {
    return parentInBatches.flatMap((batch) => batch.ins);
  }

  private newInBatchIdsFrom(inBatches: any[]) {
    return inBatches.flatMap((batch) => batch.ins).map((batch) => batch.id);
  }

  private async setOutBatches(rootBatch: BatchExportDto, outBatchIds: string[]) {
    let parentOutBatches = [rootBatch];
    do {
      const nestedOutBatches = await this.findNestedBatchesForExport(outBatchIds);
      for (const parentOutBatch of parentOutBatches) {
        this.addOutBatches(parentOutBatch, nestedOutBatches);
      }
      parentOutBatches = this.newOutBatchesFrom(parentOutBatches);
      outBatchIds = this.newOutBatchIdsFrom(nestedOutBatches);
    } while (outBatchIds.length !== 0);
  }

  private addOutBatches(parentOutBatch: BatchExportDto, outBatches: any[]) {
    const outBatchesWhichExistInParentBatch = outBatches.filter((batch) => batch.ins.map((batch) => batch.id).includes(parentOutBatch.id));
    parentOutBatch.outs = outBatchesWhichExistInParentBatch.map(mapBatchPrismaToBatchExportDto);
  }

  private newOutBatchesFrom(parentOutBatches: BatchExportDto[]) {
    return parentOutBatches.flatMap((batch) => batch.outs);
  }

  private newOutBatchIdsFrom(outBatches: any[]) {
    return outBatches.flatMap((batch) => batch.outs).map((batch) => batch.id);
  }

  private findNestedBatchesForExport(batchIds: string[]) {
    return this.prismaService.batch.findMany({
      where: {
        id: { in: batchIds },
      },
      include: readBatchIncludeQuery(),
    });
  }
}
