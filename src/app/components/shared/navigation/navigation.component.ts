import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
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
      <a mat-button [routerLink]="isAdmin ? '/admin/dashboard' : '/client/dashboard'" class="brand">
        <mat-icon>event</mat-icon>
        <span>HelloEvents</span>
      </a>

      <span class="spacer"></span>

      <!-- Admin Navigation -->
      <ng-container *ngIf="isAdmin">
        <a mat-button routerLink="/admin/dashboard" routerLinkActive="active">
          <mat-icon>dashboard</mat-icon>
          <span>Dashboard</span>
        </a>
        <a mat-button routerLink="/admin/events" routerLinkActive="active">
          <mat-icon>event_note</mat-icon>
          <span>Events</span>
        </a>
        <a mat-button routerLink="/admin/events/create" routerLinkActive="active">
          <mat-icon>add_circle</mat-icon>
          <span>Create Event</span>
        </a>
      </ng-container>

      <!-- Client Navigation -->
      <ng-container *ngIf="!isAdmin">
        <a mat-button routerLink="/client/dashboard" routerLinkActive="active">
          <mat-icon>dashboard</mat-icon>
          <span>Dashboard</span>
        </a>
        <a mat-button routerLink="/client/events" routerLinkActive="active">
          <mat-icon>event_note</mat-icon>
          <span>My Events</span>
        </a>
      </ng-container>

      <!-- User Menu -->
      <button mat-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
        <span>{{ username }}</span>
      </button>
      <mat-menu #userMenu="matMenu">
        <a mat-menu-item [routerLink]="[isAdmin ? '/admin/profile' : '/client/profile']" routerLinkActive="active">
          <mat-icon>person</mat-icon>
          <span>My Profile</span>
        </a>
        <a mat-menu-item [routerLink]="[isAdmin ? '/admin/events' : '/client/events']" routerLinkActive="active">
          <mat-icon>event_note</mat-icon>
          <span>My Events</span>
        </a>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
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

    .active {
      background: rgba(255, 255, 255, 0.1);
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
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit, OnDestroy {
  isAdmin = false;
  username = '';
  private destroy$ = new Subject<void>();
  isAuthenticated$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.isAdmin = user.roles.includes('ROLE_ADMIN');
          this.username = user.username;
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}