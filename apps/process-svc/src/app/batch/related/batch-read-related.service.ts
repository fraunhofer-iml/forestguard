import { Edge, ProcessDisplayDto } from '@forrest-guard/api-interfaces';
import { Injectable } from '@nestjs/common';
import { BatchWithInAndOut } from '../types/batch.types';
import { mapBatchPrismaToBatchDto } from '../utils/batch.mapper';
import { PrismaService } from '@forrest-guard/database';
import { readBatchByIdQuery } from '../utils/batch.queries';

@Injectable()
export class BatchReadRelatedService {
  constructor(private readonly prismaService: PrismaService) {
  }

  async readRelatedBatchesById(id: string): Promise<ProcessDisplayDto> {
    const batchesMap = new Map<string, BatchWithInAndOut>();
    const edgeSet = new Set<string>();

    const initialBatch = await this.getBatch(id);
    batchesMap.set(initialBatch.id, initialBatch);

    await this.processBatch(initialBatch, batchesMap, edgeSet);

    const edges = Array.from(edgeSet).map((edge) => JSON.parse(edge) as Edge);

    return {
      coffeeBatches: Array.from(batchesMap.values()).map(mapBatchPrismaToBatchDto),
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

  getBatch(id: string) {
    return this.prismaService.batch.findUniqueOrThrow(readBatchByIdQuery(id));
  }
}
