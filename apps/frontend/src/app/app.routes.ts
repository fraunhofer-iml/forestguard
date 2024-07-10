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
        path: 'batches',
        loadChildren: () => import('./features/batches/batches.module').then((m) => m.BatchesModule),
      },
      {
        path: 'pols',
        loadChildren: () => import('./features/plot-of-land/plot-of-land.module').then((m) => m.PlotOfLandModule)
      }
    ],
  },
];
