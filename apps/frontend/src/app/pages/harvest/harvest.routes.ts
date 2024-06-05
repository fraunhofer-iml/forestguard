import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HarvestComponent } from './harvest.component';

export const harvestRoutes: Route[] = [
  {
    path: '',
    component: HarvestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(harvestRoutes)],
  exports: [RouterModule]
})
export class HarvestRoutingModule { }
