import { BatchDto, ProofDto, ProofType } from '@forrest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { catchError, EMPTY, map, Observable, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { UploadFormSelectType } from '../../../shared/components/upload-form/upload-form-select.type';
import { Messages } from '../../../shared/messages';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { getUserOrCompanyName } from '../../../shared/utils/user-company-utils';

@Component({
  selector: 'app-pol-details',
  templateUrl: './details.component.html',
})
export class PlotOfLandDetailsComponent {
  id$ = this.route.params.pipe(map((params) => params['id']));
  batch$: Observable<BatchDto> = this.id$.pipe(switchMap((id) => this.batchesService.getBatchById(id)));
  MINIO_URL = environment.MINIO.URL;
  ProofType = ProofType;
  protected readonly getUserOrCompanyName = getUserOrCompanyName;

  uploadSelectOption: UploadFormSelectType[] = [
    {
      value: ProofType.PROOF_OF_FREEDOM,
      key: 'Proof of freedom from deforestation',
    },
    {
      value: ProofType.PROOF_OF_OWNERSHIP,
      key: 'Proof of ownership',
    },
  ];

  constructor(private route: ActivatedRoute, private batchesService: BatchService, private plotOfLandService: PlotOfLandService) {}

  getProof(type: ProofType, proofs?: ProofDto[]): ProofDto | undefined {
    return proofs?.find((proof) => proof.type === type);
  }

  uploadProof({ file, documentType }: { file: File; documentType: string }, id: string | undefined): void {
    const option = this.uploadSelectOption.find((option) => option.value === documentType);

    if (!option) return;
    option.file = file;

    if (option.file && id != undefined) {
      const formData = new FormData();
      formData.append('file', option.file);
      formData.append('type', option.value);
      this.plotOfLandService
        .createProof(id, formData)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            toast.error(error.error.message);
            return EMPTY;
          })
        )
        .subscribe(() => toast.success(Messages.successProof));
    }
  }
}
