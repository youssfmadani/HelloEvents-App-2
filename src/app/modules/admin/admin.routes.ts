import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layouts/admin-layout/admin-layout.component')
      .then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../../components/dashboard/admin-dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard'
      },
      {
        path: 'profile',
        loadComponent: () => import('../../components/profile/admin-profile/admin-profile.component')
          .then(m => m.AdminProfileComponent),
        title: 'Admin Profile'
      },
      {
        path: 'events',
        children: [
          {
            path: '',
            loadComponent: () => import('../../components/events/event-list/event-list.component')
              .then(m => m.EventListComponent),
            title: 'Manage Events'
          },
          {
            path: 'create',
            loadComponent: () => import('../../components/events/event-form/event-form.component')
              .then(m => m.EventFormComponent),
            title: 'Create Event'
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('../../components/events/event-form/event-form.component')
              .then(m => m.EventFormComponent),
            title: 'Edit Event'
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
        path: 'users',
        loadComponent: () => import('../../components/users/user-list/user-list.component')
          .then(m => m.UserListComponent),
        title: 'Manage Users'
      },
      {
        path: 'settings',
        loadComponent: () => import('../../components/settings/system-settings/system-settings.component')
          .then(m => m.SystemSettingsComponent),
        title: 'System Settings'
      }
    ]
  }
]; 