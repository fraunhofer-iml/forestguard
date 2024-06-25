import { FormGroup } from '@angular/forms';
import { HarvestForm } from '../model/forms';
import { BatchCombinedCreateDto, ProcessStepWithMultipleHarvestedLandsCreateDto } from '@forrest-guard/api-interfaces';

export class HarvestService {

  public createNewProcessStep(formGroup: FormGroup<HarvestForm>, plotsOfLand: string[]): ProcessStepWithMultipleHarvestedLandsCreateDto {
    return new ProcessStepWithMultipleHarvestedLandsCreateDto(
      '',
      formGroup.value.date?.toISOString() ?? '',
      formGroup.value.authorOfEntry ?? '',
      plotsOfLand ?? [],
      formGroup.value.processOwner ?? '',
    )
  }

  public createNewHarvestBatch(formGroup: FormGroup<HarvestForm>, plotsOfLand: string[]): BatchCombinedCreateDto {
    return new BatchCombinedCreateDto(
      formGroup.value.weight ?? 0,
      formGroup.value.recipient ?? '',
      this.createNewProcessStep(formGroup, plotsOfLand)
    )
  }
}
