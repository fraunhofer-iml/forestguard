import { AmqpException } from '@forrest-guard/amqp';
import { Edge, ProcessDisplayDto } from '@forrest-guard/api-interfaces';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Batch } from '@prisma/client';
import { BatchService } from '../batch.service';
import { mapBatchPrismaToBatchDto } from '../utils/batch.mapper';

@Injectable()
export class RelatedBatchesService {
  constructor(private batchService: BatchService) {}

  async readRelatedBatchesById(id: string): Promise<ProcessDisplayDto> {
    const batchesMap = new Map<string, Batch>();
    const edgeSet = new Set<string>();

    const initialBatch = await this.batchService.getBatchById(id);

    batchesMap.set(initialBatch.id, initialBatch);

    for (const inBatch of initialBatch.in) {
      this.processBatch(inBatch.id, initialBatch.id, edgeSet, batchesMap, 'in');
    }

    for (const outBatch of initialBatch.out) {
      await this.processBatch(initialBatch.id, outBatch.id, edgeSet, batchesMap, 'out');
    }

    await this.traverseBatch(id, batchesMap, edgeSet, 'in');
    await this.traverseBatch(id, batchesMap, edgeSet, 'out');
    const edges = Array.from(edgeSet).map((edge) => JSON.parse(edge) as Edge);

    return {
      coffeeBatches: Array.from(batchesMap.values()).map(mapBatchPrismaToBatchDto),
      edges: edges,
    };
  }

  async traverseBatch(id: string, batchesMap: Map<string, Batch>, edgeSet: Set<string>, direction: 'in' | 'out') {
    if (batchesMap.has(id)) {
      return;
    }

    const batch = await this.batchService.getBatchById(id);

    if (!batch) {
      throw new AmqpException(`Batch with id ${id} not found`, HttpStatus.NOT_FOUND);
    }

    batchesMap.set(id, batch);

    const relatedBatches = direction === 'in' ? batch.in : batch.out;
    for (const relatedBatch of relatedBatches) {
      const fromId = direction === 'in' ? relatedBatch.id : batch.id;
      const toId = direction === 'in' ? batch.id : relatedBatch.id;
      await this.processBatch(fromId, toId, edgeSet, batchesMap, direction);
    }
  }

  private async processBatch(fromId: string, toId: string, edgeSet: Set<string>, batchesMap: Map<string, Batch>, direction: 'in' | 'out') {
    const edge = JSON.stringify({ from: fromId, to: toId });
    if (!edgeSet.has(edge)) {
      edgeSet.add(edge);
      await this.traverseBatch(toId, batchesMap, edgeSet, direction);
    }
  }
}
