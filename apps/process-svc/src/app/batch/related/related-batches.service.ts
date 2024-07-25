import { AmqpException } from '@forrest-guard/amqp';
import { Edge, ProcessDisplayDto } from '@forrest-guard/api-interfaces';
import { HttpStatus, Injectable } from '@nestjs/common';
import { BatchService } from '../batch.service';
import { BatchWithInAndOut } from '../types/batch.types';
import { mapBatchPrismaToBatchDto } from '../utils/batch.mapper';

@Injectable()
export class RelatedBatchesService {
  constructor(private batchService: BatchService) {}

  async readRelatedBatchesById(id: string): Promise<ProcessDisplayDto> {
    const batchesMap = new Map<string, BatchWithInAndOut>();
    const edgeSet = new Set<string>();

    const initialBatch = await this.batchService.getBatchById(id);
    batchesMap.set(initialBatch.id, initialBatch);

    await this.processBatch(initialBatch, batchesMap, edgeSet);

    const edges = Array.from(edgeSet).map((edge) => JSON.parse(edge) as Edge);

    return {
      coffeeBatches: Array.from(batchesMap.values()).map(mapBatchPrismaToBatchDto),
      edges: edges,
    };
  }

  async processBatch(batch: BatchWithInAndOut, batchesMap: Map<string, BatchWithInAndOut>, edgeSet: Set<string>) {
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

  async traverseBatch(id: string, batchesMap: Map<string, BatchWithInAndOut>, edgeSet: Set<string>, direction: 'in' | 'out') {
    if (batchesMap.has(id)) {
      return;
    }

    const batch = await this.batchService.getBatchById(id);

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
}
