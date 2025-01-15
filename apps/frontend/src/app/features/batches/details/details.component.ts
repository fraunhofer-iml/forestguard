/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchDto, Edge, ProofDto, ProofType } from '@forest-guard/api-interfaces';
import { UiGraphComponent } from '@forest-guard/ui-graph';
import { saveAs } from 'file-saver';
import { map, Observable, switchMap, take, tap } from 'rxjs';
import { Component, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { Uris } from '../../../shared/uris';
import { getUserOrCompanyName } from '../../../shared/utils/user-company-utils';
import { BatchStatusEnum } from './enum/batchStatusEnum';

@Component({
  selector: 'app-batch-details',
  templateUrl: './details.component.html',
})
export class BatchDetailsComponent {
  @ViewChild('dependencyGraph')
  dependencyGraphComponent!: UiGraphComponent;

  innerWidth = window.innerWidth;
  protected readonly Uris = Uris;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  id$ = this.route.params.pipe(map((params) => params['id']));
  batch$: Observable<BatchDto> = this.id$.pipe(switchMap((id) => this.batchesService.getBatchById(id)));

  related$: Observable<{ coffeeBatches: BatchDto[]; edges: Edge[] }> = this.id$.pipe(
    switchMap((id) => this.batchesService.getRelatedBatches(id)),
    map(({ data }) => {
      return {
        coffeeBatches: data.coffeeBatches || [],
        edges: data.edges || [],
      };
    })
  );

  invalidEdges$ = this.related$.pipe(
    map(({ edges }) => {
      return edges.filter((edge) => edge.invalid);
    })
  );

  nodesWithEuInfoSystemId$ = this.related$.pipe(
    map(({ coffeeBatches }) => {
      return coffeeBatches.filter((batch) => batch.euInfoSystemId);
    }),
    map((batches) => batches.map((batch) => batch.id))
  );

  nodesWithProcessDocuments$ = this.related$.pipe(
    map(({ coffeeBatches }) => {
      return coffeeBatches.filter((batch) => batch.processStep.documents?.length !== 0);
    }),
    map((batches) => batches.map((batch) => batch.id))
  );

  data$: Observable<{ nodes: any[]; links: any[] }> = this.related$.pipe(
    map(({ coffeeBatches, edges }) => {
      const nodes = coffeeBatches.map((b) => ({
        id: b.id,
        name: b.processStep?.process.name,
        weight: b.weight,
        processStepDateOfProcess: b.processStep.dateOfProcess,
      }));
      // Filter edges for duplicates
      edges = edges.filter((edge, index, self) => index === self.findIndex((t) => t.from === edge.from && t.to === edge.to));
      const links = edges.map((edge) => ({ source: edge.from, target: edge.to, value: 1 }));
      return { nodes, links };
    })
  );

  MINIO_URL = environment.MINIO.URL;

  getUserOrCompanyName = getUserOrCompanyName;
  ProofType = ProofType;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly batchesService: BatchService,
    private readonly router: Router
  ) {}

  getProof(type: ProofType, proofs?: ProofDto[]): ProofDto | undefined {
    return proofs?.find((proof) => proof.type === type);
  }

  isBatchActive(active: boolean): string {
    return active ? BatchStatusEnum.active : BatchStatusEnum.inactive;
  }

  exportBatchInformationAsJson(id: string) {
    this.batchesService
      .getExportBatchById(id)
      .pipe(
        take(1),
        tap((batch) => {
          const jsonString = JSON.stringify(batch, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          saveAs(blob, 'batch.json');
        })
      )
      .subscribe();
  }

  /**
   * Find the order of the traversal of the edges
   * @param edges The edges to traverse
   * @param startId The id to start the traversal from
   * @returns The order of the traversal
   * @deprecated This function is deprecated and will be removed in the future. It is only used for v1 of the Forest Guard project.
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
      current = fromMap.get(current) ?? '';
    }

    // Traverse backwards from the startId
    current = toMap.get(startId);
    while (current) {
      order.unshift(current);
      current = toMap.get(current) ?? '';
    }

    return order.reverse();
  }

  routeToNode(id: string) {
    this.router.navigateByUrl(`/batches/${id}`);
  }

  centerDependencyGraph() {
    if (this.dependencyGraphComponent?.centerGraph) {
      this.dependencyGraphComponent.centerGraph();
    }
  }

  focusOnCurrentBatch() {
    if (this.dependencyGraphComponent?.focusOnCurrentBatch) {
      this.dependencyGraphComponent.focusOnCurrentBatch(1.5);
    }
  }

  downloadGraph(batchId: string) {
    const svgData = document.getElementById('dependencyGraphSvg');
    const currentTime = new Date().toLocaleString();

    if (this.dependencyGraphComponent?.saveGraphAsSvg && svgData) {
      this.dependencyGraphComponent.saveGraphAsSvg(svgData, 'Batch_' + batchId + '_dependency-graph_' + currentTime + '.svg');
    }
  }
}
