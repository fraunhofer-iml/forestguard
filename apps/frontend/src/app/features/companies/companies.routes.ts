import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompanyComponent } from './company/company.component';

export const companiesRoutes: Route[] = [
  {
    path: 'add',
    component: AddCompanyComponent,
  },
  {
    path: ':id',
    component: CompanyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(companiesRoutes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
