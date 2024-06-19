import { BatchDto, CoffeeBatch, Edge, ProofDto, ProofType } from '@forrest-guard/api-interfaces';
import { map, Observable, switchMap } from 'rxjs';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { getUserOrCompanyName } from '../../../shared/utils/user-company-utils';

@Component({
  selector: 'app-batch-details',
  templateUrl: './details.component.html',
})
export class BatchDetailsComponent {
  id$ = this.route.params.pipe(map((params) => params['id']));
  batch$: Observable<BatchDto> = this.id$.pipe(switchMap((id) => this.batchesService.getBatchById(id)));

  related$: Observable<{ coffeeBatches: CoffeeBatch[]; edges: string[] }> = this.id$.pipe(
    switchMap((id) => this.batchesService.getRelatedBatches(id)),
    map(({ data, id }) => {
      return {
        coffeeBatches: data.coffeeBatches || [],
        edges: this.findOrder(data.edges, id),
      };
    })
  );

  MINIO_URL = environment.MINIO.URL;

  getUserOrCompanyName = getUserOrCompanyName;
  ProofType = ProofType;

  constructor(private route: ActivatedRoute, private batchesService: BatchService) {}

  getProof(type: ProofType, proofs?: ProofDto[]): ProofDto | undefined {
    return proofs?.find((proof) => proof.type === type);
  }

  getBatchById(id: string, batches: CoffeeBatch[]): CoffeeBatch | undefined {
    return batches.find((batch) => batch.id === id);
  }

  /**
   * Find the order of the traversal of the edges
   * @param edges The edges to traverse
   * @param startId The id to start the traversal from
   * @returns The order of the traversal
   * @deprecated This function is deprecated and will be removed in the future. It is only used for v1 of the Forrest Guard project.
   */
  findOrder(edges: Edge[] | undefined, startId: string): string[] {
    if (!edges) return [];
    const fromMap = new Map<string, string>();
    const toMap = new Map<string, string>();

    // Populate the maps
    edges.forEach(({ from, to }) => {
      fromMap.set(from, to);
      toMap.set(to, from);
    });

    // Create the ordered list starting from the startId
    const order: string[] = [];
    let current: string | undefined = startId;

    // Traverse forwards from the startId
    while (current) {
      order.push(current);
      current = fromMap.get(current) || '';
    }

    // Traverse backwards from the startId
    current = toMap.get(startId);
    while (current) {
      order.unshift(current);
      current = toMap.get(current) || '';
    }

    return order.reverse();
  }
}
