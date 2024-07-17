import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddCompanyComponent } from './add-company/add-company.component';

export const companiesRoutes: Route[] = [
  {
    path: '',
    component: AddCompanyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(companiesRoutes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
