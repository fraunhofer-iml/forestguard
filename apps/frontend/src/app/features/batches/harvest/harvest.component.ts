import { FarmerDto, PlotOfLandDto, ProofDto, ProofType, UserDto } from '@forrest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { combineLatest, mergeMap, Observable } from 'rxjs';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadFormSelectType } from '../../../shared/components/upload-form/upload-form-select.type';
import { FARMER_ID } from '../../../shared/constants';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { PlotOfLandMockService } from '../../../shared/services/plotOfLand/plotOfLandMock.service';
import { UserService } from '../../../shared/services/user/user.service';
import { HarvestForm } from './model/forms';
import { HarvestService } from './service/harvest.service';

@Component({
  selector: 'app-harvest',
  templateUrl: './harvest.component.html',
})
export class HarvestComponent {
  users$: Observable<UserDto[]>;
  farmers$: Observable<FarmerDto[]>;
  harvestFormGroup: FormGroup<HarvestForm> = new FormGroup<HarvestForm>({
    processOwner: new FormControl(null, Validators.required),
    weight: new FormControl(null, [Validators.required, Validators.min(1)]),
    date: new FormControl(new Date(), Validators.required),
    plotOfLand: new FormControl(null, Validators.required),
    authorOfEntry: new FormControl(null, Validators.required),
  });

  loading = false;

  uploadSelectOption: UploadFormSelectType[] = [
    {
      value: ProofType.PROOF_OF_FREEDOM,
      key: 'Proof of freedom',
    },
    {
      value: ProofType.PROOF_OF_OWNERSHIP,
      key: 'Proof of ownership',
    },
  ];

  constructor(
    private userService: UserService,
    private batchService: BatchService,
    private plotOfLandService: PlotOfLandService,
    private companyService: CompanyService,
    private plotOfLandMockService: PlotOfLandMockService,
    private harvestService: HarvestService
  ) {
    this.users$ = this.userService.getUsers();
    this.farmers$ = this.companyService.getFarmersByCompanyId('id');
  }

  submitHarvest(): void {
    if (this.harvestFormGroup.valid && this.harvestFormGroup.value.plotOfLand) {
      this.loading = true;
      this.plotOfLandService
        .createPlotOfLand(FARMER_ID, this.plotOfLandMockService.createNewPlotOfLand(this.harvestFormGroup.value.plotOfLand))
        .pipe(
          mergeMap((plotOfLand: PlotOfLandDto) => {
            const createProofsObservables: Observable<ProofDto>[] = [];

            this.uploadSelectOption.forEach((option) => {
              if (option.file) {
                const formData = new FormData();
                formData.append('file', option.file);
                formData.append('type', option.value);
                createProofsObservables.push(this.plotOfLandService.createProof(plotOfLand.id, formData));
              }
            });

            return combineLatest([
              this.batchService.createHarvestBatches([this.harvestService.createNewHarvestBatch(this.harvestFormGroup, plotOfLand.id)]),
              ...createProofsObservables,
            ]);
          })
        )
        .subscribe(() => {
          this.loading = false;
          this.clearInputFields();
          toast.success('Harvest successfully added');
          this.uploadSelectOption.forEach((option) => {
            option.file = undefined;
          });
        });
    } else {
      this.harvestFormGroup.markAllAsTouched();
    }
  }

  clearInputFields(): void {
    this.harvestFormGroup.reset();
    this.harvestFormGroup.patchValue({
      date: new Date(),
    });
  }

  submitFile({ file, documentType }: { file: File; documentType: string }): void {
    const option = this.uploadSelectOption.find((option) => option.value === documentType);

    if (!option) return;

    option.file = file;
  }
}
