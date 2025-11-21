import { Routes } from '@angular/router';
import { itemsRouting } from '../../shared/components/items/items.routing';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'items',
  },
  {
    path: 'items',
    children: itemsRouting,
  },
  {
    path: 'details',
    loadComponent: () =>import('../../shared/components/details/details.component').then(c => c.DetailsComponent),
  },
  {
    path: '**',
    redirectTo: 'items',
  },
];
