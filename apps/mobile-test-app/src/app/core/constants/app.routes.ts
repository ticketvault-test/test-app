import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'authentication',
    loadChildren: () => import('../../authentication/core/constants/authentication.routes').then(routes => routes.authenticationRoutes),
  },
  {
    path: '**',
    loadComponent: () => import('../../shared/components/not-found-page/not-found-page.component').then(component => component.NotFoundPageComponent),
  },
];
