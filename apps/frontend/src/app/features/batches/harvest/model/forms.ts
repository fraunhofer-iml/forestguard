import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface HarvestForm {
  processOwner: FormControl<string | null>;
  recipient: FormControl<string | null>;
  weight: FormControl<number | null>;
  date: FormControl<Date | null>;
  plotsOfLand: FormArray<FormGroup>,
  authorOfEntry: FormControl<string | null>;
}
