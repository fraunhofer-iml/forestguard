import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CompanyService } from '../../shared/services/company/company.service';
import { SharedModule } from '../../shared/shared.module';
import { AddCompanyComponent } from './add-company/add-company.component';
import { AddCompanyService } from './add-company/service/add-company.service';
import { CompaniesRoutingModule } from './companies.routes';

@NgModule({
  declarations: [AddCompanyComponent],
  imports: [
    CommonModule,
    CompaniesRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SharedModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  providers: [
    CompanyService,
    AddCompanyService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
  ],
})
export class CompaniesModule {}
