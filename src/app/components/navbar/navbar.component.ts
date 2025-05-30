import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary">
      <!-- Logo -->
      <a mat-button routerLink="/" class="brand">
        <mat-icon>event</mat-icon>
        <span>HelloEvents</span>
      </a>

      <span class="spacer"></span>

      <!-- Guest Menu -->
      <ng-container *ngIf="!(isAuthenticated$ | async)">
        <a mat-button routerLink="/events">
          <mat-icon>event_note</mat-icon>
          <span>Events</span>
        </a>
        <a mat-button routerLink="/login">
          <mat-icon>login</mat-icon>
          <span>Login</span>
        </a>
        <a mat-raised-button color="accent" routerLink="/register">
          <mat-icon>person_add</mat-icon>
          <span>Register</span>
        </a>
      </ng-container>

      <!-- Authenticated Menu -->
      <ng-container *ngIf="isAuthenticated$ | async">
        <!-- Admin Menu -->
        <ng-container *ngIf="isAdmin$ | async">
          <a mat-button routerLink="/admin/dashboard">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-button routerLink="/admin/events">
            <mat-icon>event_note</mat-icon>
            <span>Manage Events</span>
          </a>
          <a mat-button routerLink="/admin/users">
            <mat-icon>people</mat-icon>
            <span>Users</span>
          </a>
        </ng-container>

        <!-- Client Menu -->
        <ng-container *ngIf="isClient$ | async">
          <a mat-button routerLink="/client/dashboard">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-button routerLink="/client/events">
            <mat-icon>event_note</mat-icon>
            <span>Browse Events</span>
          </a>
        </ng-container>

        <!-- User Menu -->
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          <span>{{ (currentUser$ | async)?.username }}</span>
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <a mat-menu-item [routerLink]="(isAdmin$ | async) ? '/admin/profile' : '/client/profile'">
            <mat-icon>person</mat-icon>
            <span>My Profile</span>
          </a>
          <a mat-menu-item [routerLink]="(isAdmin$ | async) ? '/admin/dashboard' : '/client/dashboard'">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </ng-container>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }

    mat-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 0 16px;
    }

    .brand {
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 500;
    }

    a {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    button[mat-button] {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    @media (max-width: 768px) {
      mat-toolbar {
        padding: 0 8px;
      }

      span:not(.spacer) {
        display: none;
      }

      a, button {
        min-width: 40px;
      }

      .brand span {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<any>;
  isAdmin$: Observable<boolean>;
  isClient$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.currentUser$ = this.authService.getCurrentUser();
    this.isAdmin$ = this.currentUser$.pipe(
      map(user => user?.roles?.includes('ROLE_ADMIN') ?? false)
    );
    this.isClient$ = this.currentUser$.pipe(
      map(user => user?.roles?.includes('ROLE_CLIENT') ?? false)
    );
  }

  logout(): void {
    this.authService.logout();
  }
} 