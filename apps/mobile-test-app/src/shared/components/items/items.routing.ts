import { Routes } from '@angular/router';

export const itemsRouting: Routes = [
  {
    path: '',
    loadComponent: () => import('./items.component').then(c => c.ItemsComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./item-details/item-details.component').then(c => c.ItemDetailsComponent),
  },
];
