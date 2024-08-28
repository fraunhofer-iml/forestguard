import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { AddCompanyComponent } from './add-company/add-company.component';
import { CompanyComponent } from './company/company.component';

export const companiesRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'id',
    pathMatch: 'full',
  },
  {
    path: 'add',
    component: AddCompanyComponent,
  },
  {
    path: ':id',
    component: CompanyComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(companiesRoutes)],
  exports: [RouterModule],
})
export class CompaniesRoutingModule {}
