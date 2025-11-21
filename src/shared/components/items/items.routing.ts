import { Routes } from '@angular/router';

export const itemsRouting: Routes = [
  {
    path: '',
    loadComponent: () => import('./items.component').then(c => c.ItemsComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('../items/item-details/item-details.component').then(c => c.ItemDetailsComponent),
  },
];
