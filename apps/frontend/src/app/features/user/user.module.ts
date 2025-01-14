/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
