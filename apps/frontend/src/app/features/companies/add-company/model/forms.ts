import { FormControl } from '@angular/forms';

export interface CompanyForm {
  name: FormControl<string | null>;
  state: FormControl<string | null>;
  country: FormControl<string | null>;
  street: FormControl<string | null>;
  postalCode: FormControl<string | null>;
  city: FormControl<string | null>;
}
