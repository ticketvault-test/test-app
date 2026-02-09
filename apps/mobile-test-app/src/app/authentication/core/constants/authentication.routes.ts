import { Routes } from '@angular/router';

import { AuthenticationComponent } from '../authentication.component';

export const authenticationRoutes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        loadComponent: () => import('../../pages/login/login-page.component').then(component => component.LoginPageComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('../../pages/forgot-password/forgot-password.component').then(component => component.ForgotPasswordComponent),
      },
    ],
  },
];
