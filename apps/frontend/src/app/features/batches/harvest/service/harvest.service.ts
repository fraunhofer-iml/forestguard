import { BatchCombinedCreateDto, ProcessStepWithMultipleHarvestedLandsCreateDto } from '@forest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';
import { HarvestForm } from '../model/forms';

export class HarvestService {
  public createNewProcessStep(formGroup: FormGroup<HarvestForm>, plotsOfLand: string[]): ProcessStepWithMultipleHarvestedLandsCreateDto {
    return new ProcessStepWithMultipleHarvestedLandsCreateDto(
      '',
      formGroup.value.dateOfProcess?.toISOString() ?? '',
      formGroup.value.processOwner ?? '',
      plotsOfLand ?? [],
      formGroup.value.authorOfEntry ?? ''
    );
  }

  public createNewHarvestBatch(formGroup: FormGroup<HarvestForm>, plotsOfLand: string[]): BatchCombinedCreateDto {
    return new BatchCombinedCreateDto(
      formGroup.value.weight ?? 0,
      formGroup.value.recipient ?? '',
      this.createNewProcessStep(formGroup, plotsOfLand)
    );
  }
}
