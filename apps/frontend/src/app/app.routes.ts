import { Route } from '@angular/router';
import { ContentLayoutComponent } from './layouts/content-layout/content-layout.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'harvest',
        loadChildren: () =>
          import('./pages/harvest/harvest.module').then(
            (m) => m.HarvestModule
          ),
      },
    ],
  },
];
