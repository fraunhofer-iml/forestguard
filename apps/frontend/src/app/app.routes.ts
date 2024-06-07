import { Route } from '@angular/router';
import { ContentLayoutComponent } from './core/components/content-layout/content-layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'batches',
        pathMatch: 'full',
      },
      {
        path: 'harvest',
        loadChildren: () => import('./features/harvest/harvest.module').then((m) => m.HarvestModule),
      },
      {
        path: 'batches',
        loadChildren: () => import('./features/batches/batches.module').then((m) => m.BatchesModule),
      },
      {
        path: 'overview',
        loadChildren: () =>
          import('./pages/overview/overview.module').then(
            (m) => m.OverviewModule
          ),
      },
    ],
  },
];
