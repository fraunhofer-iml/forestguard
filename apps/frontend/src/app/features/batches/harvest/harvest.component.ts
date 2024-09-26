import { CompanyDto, PlotOfLandDto, UserDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { catchError, EMPTY, filter, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Messages } from '../../../shared/messages';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { HarvestForm } from './model/forms';
import { HarvestService } from './service/harvest.service';

@Component({
  selector: 'app-harvest',
  templateUrl: './harvest.component.html',
})
export class HarvestComponent {
  companyId = this.authenticationService.getCurrentCompanyId() ?? '';
  loading = false;
  companies$: Observable<CompanyDto[]> = this.companyService.getCompanies();
  users$: Observable<UserDto[]> = this.companyService.getEmployeesOfCompany(this.companyId);
  farmers$: Observable<UserOrFarmerDto[]> = this.companyService.getFarmersByCompanyId(
    this.authenticationService.getCurrentCompanyId() ?? ''
  );
  harvestFormGroup: FormGroup<HarvestForm> = new FormGroup<HarvestForm>({
    processOwner: new FormControl(null, Validators.required),
    recipient: new FormControl(null, Validators.required),
    weight: new FormControl(null, [Validators.required, Validators.min(1)]),
    date: new FormControl(new Date(), Validators.required),
    authorOfEntry: new FormControl(null, Validators.required),
    plotsOfLand: new FormArray([this.createPlotOfLand()]),
  });

  plotsOfLand$: Observable<PlotOfLandDto[]> = this.harvestFormGroup.controls.processOwner.valueChanges.pipe(
    filter((farmerId): farmerId is string => !!farmerId),
    switchMap((farmerId) => this.plotOfLandService.getPlotsOfLandByFarmerId(farmerId)),
    tap(() => this.plotsOfLand.enable())
  );
  filteredPlotsOfLand$: Observable<PlotOfLandDto[]> = this.plotsOfLand$.pipe(
    switchMap((plotsOfLand) =>
      this.plotsOfLand.valueChanges.pipe(
        map((value) => value.map((item: { plotOfLand: PlotOfLandDto | null }) => item.plotOfLand?.id)),
        startWith([]),
        map((value) => plotsOfLand.filter((plot) => value && !value.includes(plot.id)))
      )
    )
  );

  constructor(
    private batchService: BatchService,
    private plotOfLandService: PlotOfLandService,
    private companyService: CompanyService,
    private harvestService: HarvestService,
    private authenticationService: AuthenticationService
  ) {
    this.plotsOfLand.disable();
  }

  get plotsOfLand(): FormArray {
    return this.harvestFormGroup.get('plotsOfLand') as FormArray;
  }

  createPlotOfLand(): FormGroup {
    return new FormGroup({
      plotOfLand: new FormControl<PlotOfLandDto | null>(null, Validators.required),
    });
  }

  addPlotOfLand(): void {
    if (this.harvestFormGroup.get('processOwner')?.value != null) {
      this.plotsOfLand.push(this.createPlotOfLand());
    }
  }

  removePlotOfLand(index: number): void {
    this.plotsOfLand.removeAt(index);
  }

  submitHarvest(): void {
    const plotsOfLand = this.plotsOfLand.value.map((item: { plotOfLand: PlotOfLandDto | null }) => item.plotOfLand?.id);

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
}
