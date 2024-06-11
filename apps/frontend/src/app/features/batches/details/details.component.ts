import { BatchDto, ProofDto, ProofType } from '@forrest-guard/api-interfaces';
import { map, Observable, switchMap, take } from 'rxjs';
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
  batch$: Observable<BatchDto> = this.id$.pipe(
    take(1),
    switchMap((id) => this.batchesService.getBatchById(id))
  );

  MINIO_URL = environment.MINIO.URL;

  getUserOrCompanyName = getUserOrCompanyName;
  ProofType = ProofType;

  constructor(private route: ActivatedRoute, private batchesService: BatchService) {}

  getProof(type: ProofType, proofs?: ProofDto[]): ProofDto | undefined {
    return proofs?.find((proof) => proof.type === type);
  }
}
