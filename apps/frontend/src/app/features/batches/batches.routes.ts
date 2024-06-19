import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BatchDetailsComponent } from './details/details.component';
import { HarvestComponent } from './harvest/harvest.component';
import { BatchOverviewComponent } from './overview/overview.component';
import { BatchUpdateComponent } from './update/batch-update.component';

export const batchesRoutes: Route[] = [
  {
    path: '',
    component: BatchOverviewComponent,
  },
  {
    path: 'harvest',
    component: HarvestComponent,
  },
  {
    path: 'update',
    component: BatchUpdateComponent,
  },
  {
    path: ':id',
    component: BatchDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(batchesRoutes)],
  exports: [RouterModule],
})
export class BatchesRoutingModule {}
