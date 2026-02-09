import { Routes } from '@angular/router';

export const eventRoutes: Routes = [
  {
    path: 'block/:blockId',
    loadComponent: () => import('../components/block-details/block-details.component').then(component => component.BlockDetailsComponent),
  },
];
