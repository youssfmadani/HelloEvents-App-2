import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-sidenav-container class="client-container">
      <mat-sidenav #sidenav mode="side" [opened]="!isMobile" [mode]="isMobile ? 'over' : 'side'" class="client-sidenav">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">person</mat-icon>
          <h2>Client Portal</h2>
        </div>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/client/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <h3 matSubheader>Events</h3>
          <a mat-list-item routerLink="/client/events" routerLinkActive="active">
            <mat-icon matListItemIcon>event_note</mat-icon>
            <span matListItemTitle>Browse Events</span>
          </a>
          <a mat-list-item routerLink="/client/events/registered" routerLinkActive="active">
            <mat-icon matListItemIcon>event_available</mat-icon>
            <span matListItemTitle>My Events</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <h3 matSubheader>Account</h3>
          <a mat-list-item routerLink="/client/profile" routerLinkActive="active">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>My Profile</span>
          </a>
          <a mat-list-item routerLink="/client/settings" routerLinkActive="active">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>Settings</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          
          <span class="toolbar-spacer"></span>
          
          <button mat-icon-button [matMenuTriggerFor]="profileMenu">
            <mat-icon>account_circle</mat-icon>
            <span class="username-text" *ngIf="!isMobile">{{ username }}</span>
          </button>
          <mat-menu #profileMenu="matMenu">
            <a mat-menu-item routerLink="/client/profile">
              <mat-icon>person</mat-icon>
              <span>My Profile</span>
            </a>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <div class="client-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .client-container {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .client-sidenav {
      width: 250px;
      background: #f5f5f5;
    }

    .sidenav-header {
      padding: 16px;
      text-align: center;
      background: #2196f3;
      color: white;
    }

    .logo-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 8px;
    }

    .toolbar-spacer {
      flex: 1 1 auto;
    }

    .client-content {
      padding: 20px;
      height: calc(100vh - 64px);
      overflow-y: auto;
    }

    mat-nav-list {
      .active {
        background: rgba(33, 150, 243, 0.1);
        color: #2196f3;
        
        mat-icon {
          color: #2196f3;
        }
      }

      h3 {
        padding: 16px;
        margin: 0;
        color: rgba(0, 0, 0, 0.54);
        font-size: 14px;
      }
    }

    .username-text {
      margin-left: 8px;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .client-sidenav {
        width: 200px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientLayoutComponent implements OnInit, OnDestroy {
  username = '';
  isMobile = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.checkScreenSize();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnInit(): void {
    this.authService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.username = user.username;
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    this.cdr.markForCheck();
  }

  private onResize(): void {
    this.checkScreenSize();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 