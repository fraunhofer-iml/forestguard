/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { AddUserComponent } from './add/add-user.component';
import { GenerateUserService } from './add/service/generate-user.service';
import { FarmerComponent } from './farmer/farmer.component';
import { UpdateFarmerService } from './farmer/service/update-farmer.service';
import { UsersRoutingModule } from './user.routes';

@NgModule({
  declarations: [AddUserComponent, FarmerComponent],
  imports: [
    UsersRoutingModule,
    SharedModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatTooltipModule,
    MatButtonToggle,
    MatButtonToggleGroup,
    NgIf,
    NgClass,
    AsyncPipe,
    MatOption,
    MatSelect,
    NgForOf,
    FormsModule,
  ],
  providers: [GenerateUserService, UpdateFarmerService],
})
export class UserModule {}
