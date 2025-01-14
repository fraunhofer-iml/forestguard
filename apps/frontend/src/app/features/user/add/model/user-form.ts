/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormControl } from '@angular/forms';

export interface UserForm {
  employeeId: FormControl<string | null>;
  personalId: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  phoneNumber: FormControl<string | null>;
  street: FormControl<string | null>;
  postalCode: FormControl<string | null>;
  city: FormControl<string | null>;
  country: FormControl<string | null>;
  state: FormControl<string | null>;
  additionalInformation: FormControl<string | null>;
}
