import { BatchCreateDto, BatchDto, CompanyDto, FGFile, ProcessStepCreateDto, UserDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { filter, map, merge, Observable, zip } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Messages } from '../../../shared/messages';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { CompanyService } from '../../../shared/services/company/company.service';
import { ProcessStepService } from '../../../shared/services/process-step/process.step.service';
import { Uris } from '../../../shared/uris';

@Component({
  selector: 'app-batch-update',
  templateUrl: './batch-update.component.html',
})
export class BatchUpdateComponent implements OnInit {
  batchIds: string[] = this.route.snapshot.queryParams['batchIds']?.split(',') || [];
  uploadedFiles: FGFile[] = [];
  formGroup: FormGroup = new FormGroup({
    location: new FormControl(null, Validators.required),
    date: new FormControl(new Date(), Validators.required),
    processName: new FormControl(
      {
        disabled: this.batchIds.length === 0,
        value: this.batchIds.length === 0 ? 'Harvesting' : null,
      },
      Validators.required
    ),
    recordedBy: new FormControl(null, Validators.required),
    executedBy: new FormControl(null, Validators.required),
    plotOfLand: new FormControl(null),
    euInfoSystemId: new FormControl(null),
  });

  outputBatchForm: FormGroup = new FormGroup({
    outBatches: new FormArray([this.createBatch()]),
  });

  companies$: Observable<CompanyDto[]> = this.companyService.getCompanies();
  users$: Observable<UserDto[]> = this.currentCompany.pipe(map((company) => company.employees ?? []));
  farmers$: Observable<UserOrFarmerDto[]> = this.currentCompany.pipe(map((company) => company.farmers ?? []));
  batches$ = new Observable<BatchDto[]>();

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
      recipient: new FormControl(null, Validators.required),
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

    const createBatchesDto: BatchCreateDto[] = this.outBatches.value.map((batch: { weight: number; recipient: string }) => ({
      weight: batch.weight,
      recipient: batch.recipient,
      ins: this.batchIds,
      euInfoSystemId: this.formGroup.value.euInfoSystemId,
      processStep: new ProcessStepCreateDto(
        this.formGroup.value.location,
        this.formGroup.value.date,
        this.formGroup.value.processName,
        this.formGroup.value.executedBy,
        this.formGroup.value.recordedBy,
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

  addBatchItem(): void {
    this.outBatches.push(this.createBatch());
  }

  removeBatchItem(index: number): void {
    this.outBatches.removeAt(index);
  }
}
