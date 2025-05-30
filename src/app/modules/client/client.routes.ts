import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layouts/client-layout/client-layout.component')
      .then(m => m.ClientLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../../components/dashboard/client-dashboard/client-dashboard.component')
          .then(m => m.ClientDashboardComponent),
        title: 'Client Dashboard'
      },
      {
        path: 'profile',
        loadComponent: () => import('../../components/profile/client-profile/client-profile.component')
          .then(m => m.ClientProfileComponent),
        title: 'Client Profile'
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            loadComponent: () => import('../../components/events/event-list/event-list.component')
              .then(m => m.EventListComponent),
            title: 'Browse Events'
          },
          {
            path: 'registered',
            loadComponent: () => import('../../components/events/registered-events/registered-events.component')
              .then(m => m.RegisteredEventsComponent),
            title: 'My Events'
          },
          {
            path: ':id',
            loadComponent: () => import('../../components/events/event-detail/event-detail.component')
              .then(m => m.EventDetailComponent),
            title: 'Event Details'
          }
        ]
      },
      {
        path: 'settings',
        loadComponent: () => import('../../components/settings/user-settings/user-settings.component')
          .then(m => m.UserSettingsComponent),
        title: 'Settings'
      }
    ]
  }
]; 