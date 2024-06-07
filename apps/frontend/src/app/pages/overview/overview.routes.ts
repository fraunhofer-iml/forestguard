import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { OverviewComponent } from './overview.component';

export const overviewRoutes: Route[] = [
  {
    path: '',
    component: OverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(overviewRoutes)],
  exports: [RouterModule]
})
export class OverviewRoutingModule { }
