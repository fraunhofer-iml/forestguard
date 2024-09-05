import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { SharedModule } from '../../shared/shared.module';
import { AddUserComponent } from './add/add-user.component';
import { GenerateUserService } from './add/service/generate-user.service';
import { FarmerComponent } from './farmer/farmer.component';
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
    MatButtonToggle,
    MatButtonToggleGroup,
    NgIf,
    NgClass,
    AsyncPipe,
    MatOption,
    MatSelect,
    NgForOf,
  ],
  providers: [GenerateUserService],
})
export class UserModule {}
