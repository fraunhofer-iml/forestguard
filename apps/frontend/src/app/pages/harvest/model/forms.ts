import { FormControl } from '@angular/forms';

export interface HarvestForm {
  processOwner: FormControl<string | null>;
  weight: FormControl<number | null>;
  date: FormControl<Date | null>;
  plotOfLand: FormControl<string | null>;
  authorOfEntry: FormControl<string | null>;
}
