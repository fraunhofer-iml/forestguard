import { BatchCreateDto, ProcessStepCreateDto } from '@forrest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';
import { HarvestForm } from '../model/forms';

export class HarvestService {
  public createNewProcessStep(formGroup: FormGroup<HarvestForm>, plotOfLandId: string | undefined): ProcessStepCreateDto {
    return {
      location: '',
      date: formGroup.value.date?.toISOString() ?? '',
      process: '',
      recordedBy: formGroup.value.processOwner ?? '',
      executedBy: formGroup.value.authorOfEntry ?? '',
      harvestedLand: plotOfLandId,
    };
  }

  public createNewHarvestBatch(formGroup: FormGroup<HarvestForm>, plotOfLandId: string | undefined): BatchCreateDto {
    return {
      in: [],
      weight: formGroup.value.weight ?? 0,
      recipient: formGroup.value.authorOfEntry ?? '',
      processStep: this.createNewProcessStep(formGroup, plotOfLandId),
    };
  }
}
