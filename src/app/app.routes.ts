import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard, ClientGuard } from './guards';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      
      return authService.isAuthenticated().pipe(
        map(isAuthenticated => {
          if (isAuthenticated) {
            authService.getCurrentUser().subscribe(user => {
              if (user?.roles.includes('ROLE_ADMIN')) {
                router.navigate(['/admin/dashboard']);
              } else if (user?.roles.includes('ROLE_CLIENT')) {
                router.navigate(['/client/dashboard']);
              }
            });
            return false;
          }
          router.navigate(['/login']);
          return false;
        })
      );
    }],
    loadComponent: () => import('./components/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'events',
    loadChildren: () => import('./modules/events/events.routes')
      .then(m => m.EVENTS_ROUTES)
  },
  {
    path: 'login',
    canActivate: [() => {
      const authService = inject(AuthService);
      return authService.isAuthenticated().pipe(
        map(isAuthenticated => {
          if (isAuthenticated) {
            const router = inject(Router);
            authService.getCurrentUser().subscribe(user => {
              if (user?.roles.includes('ROLE_ADMIN')) {
                router.navigate(['/admin/dashboard']);
              } else if (user?.roles.includes('ROLE_CLIENT')) {
                router.navigate(['/client/dashboard']);
              }
            });
            return false;
          }
          return true;
        })
      );
    }],
    loadComponent: () => import('./components/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component')
      .then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () => import('./modules/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'client',
    canActivate: [AuthGuard, ClientGuard],
    loadChildren: () => import('./modules/client/client.routes')
      .then(m => m.CLIENT_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
