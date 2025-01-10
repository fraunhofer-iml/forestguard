import { CompanyDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface HarvestForm {
  processOwner: FormControl<string | UserOrFarmerDto | null>;
  recipient: FormControl<string | CompanyDto | null>;
  weight: FormControl<number | null>;
  dateOfProcess: FormControl<Date | null>;
  plotsOfLand: FormArray<FormGroup>;
  authorOfEntry: FormControl<string | UserOrFarmerDto | null>;
}
