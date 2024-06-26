import { BatchCreateDto, BatchDto, ProcessStepCreateDto } from '@forrest-guard/api-interfaces';
import { toast } from 'ngx-sonner';
import { Observable, zip } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BatchService } from '../../../shared/services/batch/batch.service';
import { UserService } from '../../../shared/services/user/user.service';
import { Messages } from '../../../shared/messages';
import { Uris } from '../../../shared/uris';
import { CompanyService } from '../../../shared/services/company/company.service';
import { FARMER_ID } from '../../../shared/constants';

@Component({
  selector: 'app-batch-update',
  templateUrl: './batch-update.component.html',
  styleUrl: './batch-update.component.scss',
})
export class BatchUpdateComponent implements OnInit {
  batchIds: string[] = this.route.snapshot.queryParams['batchIds']?.split(',') || [];
  batches: BatchDto[] = []
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
  });

  outputBatchForm: FormGroup = new FormGroup({
    outBatches: new FormArray([this.createBatch()]),
  });

  farmers$= this.companyService.getFarmersByCompanyId(FARMER_ID);
  users$ = this.userService.getUsers();
  batches$ = new Observable<BatchDto[]>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private batchService: BatchService,
    private companyService: CompanyService
  ) {}

  get outBatches(): FormArray {
    return this.outputBatchForm.get('outBatches') as FormArray;
  }

  ngOnInit(): void {
    const observableList = this.batchIds.map((batchId) => this.batchService.getBatchById(batchId));

    this.batches$ = zip(...observableList);
    this.batches$.subscribe(batches => {
      this.batches = batches;
    })
  }

  getOutputWeight(): number {
    return this.outBatches.controls.reduce((total, group) => {
      const weight = group.get('weight')?.value || 0;
      return total + weight;
    }, 0);
  }

  calculateTotalWeightOfBatches(): number {
    return this.batches.reduce((total, batch) => total + batch.weight, 0);
  }

  createBatch(): FormGroup {
    return new FormGroup({
      weight: new FormControl(null, Validators.required),
      recipient: new FormControl(null, Validators.required),
    });
  }

  submit(): void {
    this.formGroup.markAllAsTouched();
    this.outputBatchForm.markAllAsTouched();

    if (this.formGroup.invalid || this.outputBatchForm.invalid) {
      toast.error(Messages.error);
    } else {

      const createBatchesDto: BatchCreateDto[] = this.outBatches.value.map((batch: {
        weight: number;
        recipient: string
      }) => ({
        weight: batch.weight,
        recipient: batch.recipient,
        in: this.batchIds,
        processStep: new ProcessStepCreateDto(
          this.formGroup.value.location,
          this.formGroup.value.date,
          this.formGroup.value.processName,
          this.formGroup.value.executedBy,
          this.formGroup.value.recordedBy,
          this.formGroup.value.plotOfLand
        ),
      }));

      this.batchService.createBatches(createBatchesDto).subscribe(() => {
        toast.success(Messages.successProcessStep);
        this.router.navigateByUrl(Uris.batches);
      });
    }
  }

  addBatchItem(): void {
    this.outBatches.push(this.createBatch());
  }

  removeBatchItem(index: number): void {
    this.outBatches.removeAt(index);
  }
}
