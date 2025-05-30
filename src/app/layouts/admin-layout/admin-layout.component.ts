import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-admin-layout',
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
    <mat-sidenav-container class="admin-container">
      <mat-sidenav #sidenav mode="side" opened class="admin-sidenav">
        <div class="sidenav-header">
          <mat-icon class="logo-icon">admin_panel_settings</mat-icon>
          <h2>Admin Panel</h2>
        </div>
        
        <mat-nav-list>
          <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <h3 matSubheader>Event Management</h3>
          <a mat-list-item routerLink="/admin/events" routerLinkActive="active">
            <mat-icon matListItemIcon>event_note</mat-icon>
            <span matListItemTitle>All Events</span>
          </a>
          <a mat-list-item routerLink="/admin/events/create" routerLinkActive="active">
            <mat-icon matListItemIcon>add_circle</mat-icon>
            <span matListItemTitle>Create Event</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <h3 matSubheader>User Management</h3>
          <a mat-list-item routerLink="/admin/users" routerLinkActive="active">
            <mat-icon matListItemIcon>group</mat-icon>
            <span matListItemTitle>Manage Users</span>
          </a>
          
          <mat-divider></mat-divider>
          
          <h3 matSubheader>Settings</h3>
          <a mat-list-item routerLink="/admin/profile" routerLinkActive="active">
            <mat-icon matListItemIcon>person</mat-icon>
            <span matListItemTitle>My Profile</span>
          </a>
          <a mat-list-item routerLink="/admin/settings" routerLinkActive="active">
            <mat-icon matListItemIcon>settings</mat-icon>
            <span matListItemTitle>System Settings</span>
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
          </button>
          <mat-menu #profileMenu="matMenu">
            <a mat-menu-item routerLink="/admin/profile">
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

        <div class="admin-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .admin-container {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .admin-sidenav {
      width: 250px;
      background: #f5f5f5;
    }

    .sidenav-header {
      padding: 16px;
      text-align: center;
      background: #3f51b5;
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

    .admin-content {
      padding: 20px;
      height: calc(100vh - 64px);
      overflow-y: auto;
    }

    mat-nav-list {
      .active {
        background: rgba(63, 81, 181, 0.1);
        color: #3f51b5;
        
        mat-icon {
          color: #3f51b5;
        }
      }

      h3 {
        padding: 16px;
        margin: 0;
        color: rgba(0, 0, 0, 0.54);
        font-size: 14px;
      }
    }

    @media (max-width: 768px) {
      .admin-sidenav {
        width: 200px;
      }
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  username = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.username = user.username;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
} 