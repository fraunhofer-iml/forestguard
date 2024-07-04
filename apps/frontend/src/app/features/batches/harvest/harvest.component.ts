import { FarmerDto, PlotOfLandDto, UserDto } from '@forrest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FARMER_ID } from '../../../shared/constants';
import { Messages } from '../../../shared/messages';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { UserService } from '../../../shared/services/user/user.service';
import { HarvestForm } from './model/forms';
import { HarvestService } from './service/harvest.service';

@Component({
  selector: 'app-harvest',
  templateUrl: './harvest.component.html',
})
export class HarvestComponent {
  loading = false;
  plotsOfLand$: Observable<PlotOfLandDto[]> | undefined;
  users$: Observable<UserDto[]> = this.userService.getUsers();
  farmers$: Observable<FarmerDto[]> = this.companyService.getFarmersByCompanyId(FARMER_ID);
  harvestFormGroup: FormGroup<HarvestForm> = new FormGroup<HarvestForm>({
    processOwner: new FormControl(null, Validators.required),
    recipient: new FormControl(null, Validators.required),
    weight: new FormControl(null, [Validators.required, Validators.min(1)]),
    date: new FormControl(new Date(), Validators.required),
    authorOfEntry: new FormControl(null, Validators.required),
    plotsOfLand: new FormArray([this.createPlotOfLand()]),
  });

  constructor(
    private userService: UserService,
    private batchService: BatchService,
    private plotOfLandService: PlotOfLandService,
    private companyService: CompanyService,
    private harvestService: HarvestService
  ) {
    this.plotsOfLand.disable();
    this.getPlotsOfLandByFarmerId();
  }

  get plotsOfLand(): FormArray {
    return this.harvestFormGroup.get('plotsOfLand') as FormArray;
  }

  createPlotOfLand(): FormGroup {
    return new FormGroup({
      plotOfLand: new FormControl(null, Validators.required),
    });
  }

  addPlotOfLand() {
    if (this.harvestFormGroup.get('processOwner')?.value != null) {
      this.plotsOfLand.push(this.createPlotOfLand());
    }
  }

  removePlotOfLand(index: number) {
    this.plotsOfLand.removeAt(index);
  }

  submitHarvest(): void {
    const plotsOfLand = this.plotsOfLand.value.map((item: { plotOfLand: string }) => item.plotOfLand);

    if (this.harvestFormGroup.valid && this.harvestFormGroup.value.plotsOfLand) {
      this.loading = true;
      this.batchService
        .createHarvestBatchesCombined(this.harvestService.createNewHarvestBatch(this.harvestFormGroup, plotsOfLand))
        .pipe(
          catchError(() => {
            this.loading = false;
            toast.error(Messages.errorCreateHarvest);
            return EMPTY;
          })
        )
        .subscribe(() => {
          this.loading = false;
          this.clearInputFields();
          toast.success(Messages.successHarvest);
        });
    } else {
      this.harvestFormGroup.markAllAsTouched();
      toast.error(Messages.error);
    }
  }

  clearInputFields(): void {
    this.plotsOfLand.clear();
    this.addPlotOfLand();
    this.plotsOfLand.disable();
    this.harvestFormGroup.reset();
    this.harvestFormGroup.patchValue({
      date: new Date(),
    });
  }

  private getPlotsOfLandByFarmerId(): void {
    this.harvestFormGroup.controls.processOwner.valueChanges.subscribe((farmerId) => {
      if (farmerId) {
        this.plotsOfLand$ = this.plotOfLandService.getPlotsOfLandByFarmerId(farmerId);
        this.plotsOfLand$.subscribe(() => {
          this.plotsOfLand.enable();
        });
      }
    });
  }
}
