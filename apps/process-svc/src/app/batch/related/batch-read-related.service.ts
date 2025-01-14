/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchDto, Edge, ProcessDisplayDto } from '@forest-guard/api-interfaces';
import { PrismaService } from '@forest-guard/database';
import { Injectable } from '@nestjs/common';
import { BatchWithInAndOut } from '../types/batch.types';
import { mapBatchPrismaToBatchDto } from '../utils/batch.mapper';
import { readBatchByIdQuery } from '../utils/batch.queries';

@Injectable()
export class BatchReadRelatedService {
  constructor(private readonly prismaService: PrismaService) {}

  async readRelatedBatchesById(id: string): Promise<ProcessDisplayDto> {
    const batchesMap = new Map<string, BatchWithInAndOut>();
    const edgeSet = new Set<string>();

    const initialBatch = await this.getBatch(id);
    batchesMap.set(initialBatch.id, initialBatch);

    await this.processBatch(initialBatch, batchesMap, edgeSet);

    const edges = Array.from(edgeSet).map((edge) => JSON.parse(edge) as Edge);

    const coffeeBatches = Array.from(batchesMap.values()).map(mapBatchPrismaToBatchDto);

    const invalidBatches = coffeeBatches.filter(
      (batch) => batch.processStep.farmedLand && batch.processStep.farmedLand?.proofs?.length !== 2
    );

    this.invalidateBatches(
      coffeeBatches,
      edges,
      invalidBatches.map((batch) => batch.id)
    );

    return {
      coffeeBatches: coffeeBatches,
      edges: edges,
    };
  }

  private async processBatch(batch: BatchWithInAndOut, batchesMap: Map<string, BatchWithInAndOut>, edgeSet: Set<string>) {
    for (const relatedBatch of batch.ins) {
      const edge = JSON.stringify({ from: relatedBatch.id, to: batch.id });
      if (!edgeSet.has(edge)) {
        edgeSet.add(edge);
        await this.traverseBatch(relatedBatch.id, batchesMap, edgeSet, 'in');
      }
    }

    for (const relatedBatch of batch.outs) {
      const edge = JSON.stringify({ from: batch.id, to: relatedBatch.id });
      if (!edgeSet.has(edge)) {
        edgeSet.add(edge);
        await this.traverseBatch(relatedBatch.id, batchesMap, edgeSet, 'out');
      }
    }
  }

  private async traverseBatch(id: string, batchesMap: Map<string, BatchWithInAndOut>, edgeSet: Set<string>, direction: 'in' | 'out') {
    if (batchesMap.has(id)) {
      return;
    }

    const batch = await this.getBatch(id);

    batchesMap.set(id, batch);

    const relatedBatches = direction === 'in' ? batch.ins : batch.outs;
    for (const relatedBatch of relatedBatches) {
      const edge =
        direction === 'in'
          ? JSON.stringify({ from: relatedBatch.id, to: batch.id })
          : JSON.stringify({ from: batch.id, to: relatedBatch.id });

      if (!edgeSet.has(edge)) {
        edgeSet.add(edge);
        await this.traverseBatch(relatedBatch.id, batchesMap, edgeSet, direction);
      }
    }
  }

  private invalidateBatches(batches: BatchDto[], edges: Edge[], invalidBatchIds: string[]) {
    const batchMap = new Map<string, BatchDto>();
    batches.forEach((batch) => batchMap.set(batch.id, batch));

    const adjacentBatches = new Map<string, string[]>();
    edges.forEach((edge) => {
      if (!adjacentBatches.has(edge.from)) {
        adjacentBatches.set(edge.from, []);
      }
      adjacentBatches.get(edge.from).push(edge.to);
    });

    const batchesToInvalidate = new Set<string>();

    function dfs(batchId: string) {
      if (batchesToInvalidate.has(batchId)) {
        return;
      }

      batchesToInvalidate.add(batchId);

      const adjacent = adjacentBatches.get(batchId);
      if (adjacent) {
        adjacent.forEach((adj) => {
          dfs(adj);
        });
      }
    }

    invalidBatchIds.forEach((batchId) => {
      dfs(batchId);
    });

    const invalidEdges = edges.filter((edge) => batchesToInvalidate.has(edge.from));

    invalidEdges.forEach((edge) => {
      edge.invalid = true;
    });
  }

  getBatch(id: string) {
    return this.prismaService.batch.findUniqueOrThrow(readBatchByIdQuery(id));
  }
}
