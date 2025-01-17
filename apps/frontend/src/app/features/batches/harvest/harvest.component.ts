/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyDto, PlotOfLandDto, UserDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { catchError, EMPTY, filter, map, Observable, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Messages } from '../../../shared/messages';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { PlotOfLandService } from '../../../shared/services/plotOfLand/plotOfLand.service';
import { getUserOrCompanyName } from '../../../shared/utils/user-company-utils';
import { HarvestForm } from './model/forms';
import { HarvestService } from './service/harvest.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-harvest',
  templateUrl: './harvest.component.html',
})
export class HarvestComponent {
  companyId = this.authenticationService.getCurrentCompanyId() ?? '';
  loading = false;
  companies$: Observable<CompanyDto[]> = this.companyService.getCompanies();
  filteredCompanies$: Observable<CompanyDto[]> = this.companies$.pipe(
    switchMap(
      (companies) =>
        this.harvestFormGroup.controls.recipient.valueChanges.pipe(
          startWith(''),
          map((value) =>
            companies.filter((company) => {
              if (!value || typeof value !== 'string') return company;

              return company.name.toLowerCase().includes((value as string).toLowerCase() ?? '');
            })
          )
        ) ?? []
    )
  );

  users$: Observable<UserDto[]> = this.companies$.pipe(
    map((companies) => companies.filter((company) => company.id === this.companyId)),
    map((companies) => companies.flatMap((company) => company.employees ?? [])),
    switchMap(
      (farmers) =>
        this.harvestFormGroup.controls.authorOfEntry.valueChanges.pipe(
          startWith(''),
          map((value) =>
            farmers.filter((farmer) => {
              if (!value || typeof value !== 'string') return farmer;

              return (
                farmer.firstName.toLowerCase().includes((value as string).toLowerCase() ?? '') ||
                farmer.lastName.toLowerCase().includes((value as string).toLowerCase() ?? '')
              );
            })
          )
        ) ?? []
    )
  );
  farmers$: Observable<UserOrFarmerDto[]> = this.companies$.pipe(
    map((companies) => companies.filter((company) => company.id === this.companyId)),
    map((companies) => companies.flatMap((company) => company.farmers ?? [])),
    switchMap(
      (farmers) =>
        this.harvestFormGroup.controls.processOwner.valueChanges.pipe(
          startWith(''),
          map((value) =>
            farmers.filter((farmer) => {
              if (!value || typeof value !== 'string') return farmer;

              return (
                farmer.firstName.toLowerCase().includes((value as string).toLowerCase()) ||
                farmer.lastName.toLowerCase().includes((value as string).toLowerCase())
              );
            })
          )
        ) ?? []
    )
  );

  harvestFormGroup: FormGroup<HarvestForm> = new FormGroup<HarvestForm>({
    processOwner: new FormControl(null, Validators.required),
    recipient: new FormControl(null, Validators.required),
    weight: new FormControl(null, [Validators.required, Validators.min(1)]),
    dateOfProcess: new FormControl(new Date(), Validators.required),
    authorOfEntry: new FormControl(null, Validators.required),
    plotsOfLand: new FormArray([this.createPlotOfLand()]),
  });

  plotsOfLand$: Observable<PlotOfLandDto[]> = this.harvestFormGroup.controls.processOwner.valueChanges.pipe(
    switchMap((farmer: UserOrFarmerDto | string | null) => {
      if (!farmer || typeof farmer === 'string') {
        return of([]);
      }

      return this.plotOfLandService.getPlotsOfLandByFarmerId((farmer as UserOrFarmerDto).id);
    }),
    tap(() => {
      this.plotsOfLand.clear();
      this.addPlotOfLand();
    }),
    shareReplay(1)
  );
  filteredPlotsOfLand$: Observable<PlotOfLandDto[]> = this.plotsOfLand$.pipe(
    switchMap((plotsOfLand) =>
      this.plotsOfLand.valueChanges.pipe(
        map((value) => value.map((item: { plotOfLand: PlotOfLandDto | null }) => item.plotOfLand?.id)),
        startWith([]),
        map((value) =>
          plotsOfLand.filter((plot) => value && !value.includes(plot.id) && !this.harvestFormGroup.controls.processOwner.invalid)
        )
      )
    )
  );
  protected readonly getUserOrCompanyName = getUserOrCompanyName;

  constructor(
    private readonly batchService: BatchService,
    private readonly plotOfLandService: PlotOfLandService,
    private readonly companyService: CompanyService,
    private readonly harvestService: HarvestService,
    private readonly authenticationService: AuthenticationService
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
    this.plotsOfLand.push(this.createPlotOfLand());
  }

  removePlotOfLand(index: number): void {
    this.plotsOfLand.removeAt(index);
  }

  submitHarvest(): void {
    if (!this.checkAllSelections()) return;
    const plotsOfLand = this.plotsOfLand.value.map((item: { plotOfLand: PlotOfLandDto | null }) => item.plotOfLand?.id);

    if (this.harvestFormGroup.valid && this.harvestFormGroup.value.plotsOfLand) {
      this.loading = true;
      this.batchService
        .createHarvestBatchesCombined(this.harvestService.createNewHarvestBatch(this.harvestFormGroup, plotsOfLand))
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.loading = false;
            toast.error(error.error.message);
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

  checkAllSelections(): boolean {
    let returnValue = true;
    const controls = this.harvestFormGroup.controls;
    const values = this.harvestFormGroup.value;
    const error = {
      noObjectSelected: true,
    };
    if (typeof values.authorOfEntry === 'string') {
      returnValue = false;
      controls.authorOfEntry.setErrors(error);
    }
    if (typeof values.recipient === 'string') {
      returnValue = false;
      controls.recipient.setErrors(error);
    }

    if (typeof values.processOwner === 'string') {
      returnValue = false;
      controls.processOwner.setErrors(error);
    }

    return returnValue;
  }

  clearInputFields(): void {
    this.plotsOfLand.clear();
    this.addPlotOfLand();
    this.plotsOfLand.disable();
    this.harvestFormGroup.reset();
    this.harvestFormGroup.patchValue({
      dateOfProcess: new Date(),
    });
  }
}
