import {
  BatchCombinedCreateDto,
  CompanyDto,
  ProcessStepWithMultipleHarvestedLandsCreateDto,
  UserOrFarmerDto,
} from '@forest-guard/api-interfaces';
import { FormGroup } from '@angular/forms';
import { HarvestForm } from '../model/forms';

export class HarvestService {
  public createNewProcessStep(formGroup: FormGroup<HarvestForm>, plotsOfLand: string[]): ProcessStepWithMultipleHarvestedLandsCreateDto {
    return new ProcessStepWithMultipleHarvestedLandsCreateDto(
      '',
      formGroup.value.dateOfProcess?.toISOString() ?? '',
      (formGroup.value.processOwner as UserOrFarmerDto).id ?? '',
      plotsOfLand ?? [],
      (formGroup.value.authorOfEntry as UserOrFarmerDto).id ?? ''
    );
  }

  public createNewHarvestBatch(formGroup: FormGroup<HarvestForm>, plotsOfLand: string[]): BatchCombinedCreateDto {
    return new BatchCombinedCreateDto(
      formGroup.value.weight ?? 0,
      (formGroup.value.recipient as CompanyDto).id ?? '',
      this.createNewProcessStep(formGroup, plotsOfLand)
    );
  }
}
