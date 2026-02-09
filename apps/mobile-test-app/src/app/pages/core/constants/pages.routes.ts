import { Routes } from '@angular/router';

import { PagesComponent } from '../pages.component';
import { eventRoutes } from '../../event/constants/event.routes';
import { EventStore } from '../../event/store/event/event.store';
import { EventsListStore } from '../../events-list/store/events-list/events-list.store';

export const pagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'events',
      },
      {
        path: 'events',
        providers: [EventsListStore],
        loadComponent: () => import('../../events-list/events-list.component').then(component => component.EventsListComponent),
      },
      {
        path: 'event/:eventId',
        providers: [EventStore],
        loadComponent: () => import('../../event/event.component').then(component => component.EventComponent),
        children: eventRoutes,
      },
    ],
  },
];
