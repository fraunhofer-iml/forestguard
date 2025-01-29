/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { BatchCreateDto, BatchDto, CompanyDto, FGFile, ProcessStepCreateDto, UserDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { filter, map, merge, Observable, startWith, switchMap, zip } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Messages } from '../../../shared/messages';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { ProcessStepService } from '../../../shared/services/process-step/process.step.service';
import { Uris } from '../../../shared/uris';
import { getFormattedUserName, getUserOrCompanyName } from '../../../shared/utils/user-company-utils';

@Component({
  selector: 'app-batch-update',
  templateUrl: './batch-update.component.html',
})
export class BatchUpdateComponent implements OnInit {
  batchIds: string[] = this.route.snapshot.queryParams['batchIds']?.split(',') || [];
  uploadedFiles: FGFile[] = [];
  maxDate: Date = new Date();
  formGroup: FormGroup = new FormGroup({
    location: new FormControl(null, Validators.required),
    dateOfProcess: new FormControl(new Date(), Validators.required),
    processName: new FormControl(
      {
        disabled: this.batchIds.length === 0,
        value: this.batchIds.length === 0 ? 'Harvesting' : null,
      },
      Validators.required
    ),
    recordedBy: new FormControl<string | UserOrFarmerDto | null>(null, Validators.required),
    executedBy: new FormControl<string | UserOrFarmerDto | null>(null, Validators.required),
    plotOfLand: new FormControl(null),
    euInfoSystemId: new FormControl(null),
    hsCode: new FormControl(null),
  });

  outputBatchForm: FormGroup = new FormGroup({
    outBatches: new FormArray([this.createBatch()]),
  });

  companies$: Observable<CompanyDto[]> = this.companyService.getCompanies();
  users$: Observable<UserDto[]> = this.currentCompany.pipe(
    map((company) => company.employees ?? []),
    switchMap(
      (users) =>
        this.formGroup.controls['recordedBy'].valueChanges.pipe(
          startWith(''),
          map((value) =>
            users.filter((user) => {
              if (!value || typeof value !== 'string') return user;

              return (
                user.firstName.toLowerCase().includes((value as string).toLowerCase() ?? '') ||
                user.lastName.toLowerCase().includes((value as string).toLowerCase() ?? '')
              );
            })
          )
        ) ?? []
    )
  );
  processOwners$: Observable<UserOrFarmerDto[]> = this.currentCompany.pipe(
    map((company) => [...(company.farmers ?? []), ...(company.employees ?? [])]),
    switchMap(
      (users) =>
        this.formGroup.controls['executedBy'].valueChanges.pipe(
          startWith(''),
          map((value) =>
            users.filter((user) => {
              if (!value || typeof value !== 'string') return user;

              return (
                user.firstName.toLowerCase().includes((value as string).toLowerCase() ?? '') ||
                user.lastName.toLowerCase().includes((value as string).toLowerCase() ?? '')
              );
            })
          )
        ) ?? []
    )
  );
  batches$ = new Observable<BatchDto[]>();

  protected readonly getFormattedUserName = getFormattedUserName;
  protected readonly getUserOrCompanyName = getUserOrCompanyName;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly batchService: BatchService,
    private readonly companyService: CompanyService,
    private readonly authenticationService: AuthenticationService,
    private readonly processStepService: ProcessStepService
  ) {}

  get outBatches(): FormArray {
    return this.outputBatchForm.get('outBatches') as FormArray;
  }

  get currentCompany(): Observable<CompanyDto> {
    return this.companies$.pipe(
      map((companies) => companies.find((company) => company.id === this.authenticationService.getCurrentCompanyId())),
      filter((company): company is CompanyDto => !!company)
    );
  }

  ngOnInit(): void {
    const observableList = this.batchIds.map((batchId) => this.batchService.getBatchById(batchId));

    this.batches$ = zip(...observableList);
  }

  hsCodeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9 ]/g, '');
  }

  getOutputWeight(): number {
    return this.outBatches.controls.reduce((total, group) => {
      const weight = group.get('weight')?.value || 0;
      return total + weight;
    }, 0);
  }

  calculateTotalWeightOfBatches(batches: BatchDto[]): number {
    return batches.reduce((total, batch) => total + batch.weight, 0);
  }

  createBatch(): FormGroup {
    return new FormGroup({
      weight: new FormControl(null, Validators.required),
      recipient: new FormControl<string | CompanyDto | null>(null, Validators.required),
    });
  }

  submitFile({ file, documentType }: FGFile): void {
    this.uploadedFiles.push({ file, documentType });
  }

  removeFile({ file, documentType }: FGFile): void {
    this.uploadedFiles = this.uploadedFiles.filter(
      (uploadedFile: FGFile) => uploadedFile.file !== file && uploadedFile.documentType !== documentType
    );
  }

  submit(): void {
    this.formGroup.markAllAsTouched();
    this.outputBatchForm.markAllAsTouched();

    if (this.formGroup.invalid || this.outputBatchForm.invalid) {
      toast.error(Messages.error);
      return;
    }

    if (!this.checkFilters()) return;

    const createBatchesDto: BatchCreateDto[] = this.outBatches.value.map((batch: { weight: number; recipient: CompanyDto }) => ({
      weight: batch.weight,
      recipient: batch.recipient.id,
      ins: this.batchIds,
      euInfoSystemId: this.formGroup.value.euInfoSystemId,
      hsCode: this.formGroup.value.hsCode,
      processStep: new ProcessStepCreateDto(
        this.formGroup.value.location,
        this.formGroup.value.dateOfProcess,
        this.formGroup.value.processName,
        this.formGroup.value.executedBy.id,
        this.formGroup.value.recordedBy.id,
        this.formGroup.value.plotOfLand
      ),
    }));

    this.batchService.createBatches(createBatchesDto).subscribe((processStep) => {
      if (this.uploadedFiles.length > 0) {
        const fileUploads: Observable<Document>[] = this.uploadedFiles.map((uploadedFile: FGFile) => {
          return this.processStepService.addDocToProcessStep(processStep.processStepId, uploadedFile.file, uploadedFile.documentType ?? '');
        });
        merge(...fileUploads).subscribe();
      }
      toast.success(Messages.successProcessStep);
      this.router.navigateByUrl(Uris.batches);
    });
  }

  private checkFilters(): boolean {
    let isValid = true;
    if (typeof this.formGroup.value.executedBy === 'string') {
      this.formGroup.controls['executedBy'].setErrors({ invalid: true });
      isValid = false;
    }
    if (typeof this.formGroup.value.recordedBy === 'string') {
      this.formGroup.controls['recordedBy'].setErrors({ invalid: true });
      isValid = false;
    }
    for (let i = 0; i < this.outBatches.length; i++) {
      const batch = this.outBatches.controls[i];
      if (typeof batch.value.recipient === 'string') {
        batch.get('recipient')?.setErrors({ invalid: true });
        isValid = false;
      }
    }
    return isValid;
  }

  addBatchItem(): void {
    this.outBatches.push(this.createBatch());
  }

  removeBatchItem(index: number): void {
    this.outBatches.removeAt(index);
  }
}
