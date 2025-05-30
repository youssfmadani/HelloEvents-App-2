import { Routes } from '@angular/router';

export const EVENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../components/events/event-list/event-list.component')
      .then(m => m.EventListComponent),
    title: 'Events'
  },
  {
    path: ':id',
    loadComponent: () => import('../../components/events/event-detail/event-detail.component')
      .then(m => m.EventDetailComponent),
    title: 'Event Details'
  }
]; 