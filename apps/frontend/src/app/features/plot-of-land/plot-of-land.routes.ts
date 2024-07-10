import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PlotOfLandComponent } from './plot-of-land.component';

export const plotOfLandRoutes: Route[] = [
  {
    path: '',
    component: PlotOfLandComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(plotOfLandRoutes)],
  exports: [RouterModule],
})
export class PlotOfLandRoutingModule {}
