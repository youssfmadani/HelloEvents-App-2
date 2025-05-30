import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { StatsService } from '../../../services/stats.service';
import { JwtResponse } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    MatChipsModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Profile Section -->
      <mat-card class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <mat-icon class="avatar-icon">account_circle</mat-icon>
          </div>
          <mat-card-title>{{ userData?.username }}</mat-card-title>
          <mat-card-subtitle>System Administrator</mat-card-subtitle>
          <div class="role-chip">
            <mat-chip-set>
              <mat-chip color="primary" selected>ADMIN</mat-chip>
            </mat-chip-set>
          </div>
        </div>

        <mat-divider></mat-divider>

        <mat-card-content>
          <div class="profile-info">
            <div class="info-item">
              <mat-icon>email</mat-icon>
              <span>{{ userData?.email }}</span>
            </div>
            <div class="info-item">
              <mat-icon>verified_user</mat-icon>
              <span>Account ID: {{ userData?.id }}</span>
            </div>
            <div class="info-item">
              <mat-icon>access_time</mat-icon>
              <span>Last Login: {{ lastLogin | date:'medium' }}</span>
            </div>
            <div class="info-item">
              <mat-icon>security</mat-icon>
              <span>Account Status: Active</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Statistics Section -->
      <div class="stats-grid">
        <!-- Events Stats -->
        <mat-card class="stats-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>event</mat-icon>
            <mat-card-title>Events Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-container">
              <div class="stat-item">
                <div class="stat-value">{{ eventsCreated }}</div>
                <div class="stat-label">Total Events</div>
                <mat-progress-bar mode="determinate" [value]="(eventsCreated / 100) * 100"></mat-progress-bar>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ activeEvents }}</div>
                <div class="stat-label">Active Events</div>
                <mat-progress-bar mode="determinate" [value]="(activeEvents / eventsCreated) * 100"></mat-progress-bar>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ completedEvents }}</div>
                <div class="stat-label">Completed Events</div>
                <mat-progress-bar mode="determinate" [value]="(completedEvents / eventsCreated) * 100"></mat-progress-bar>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Users Stats -->
        <mat-card class="stats-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>group</mat-icon>
            <mat-card-title>Users Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-container">
              <div class="stat-item">
                <div class="stat-value">{{ totalUsers }}</div>
                <div class="stat-label">Total Users</div>
                <mat-progress-bar mode="determinate" [value]="(totalUsers / 100) * 100"></mat-progress-bar>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ activeUsers }}</div>
                <div class="stat-label">Active Users</div>
                <mat-progress-bar mode="determinate" [value]="(activeUsers / totalUsers) * 100"></mat-progress-bar>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ newUsersThisMonth }}</div>
                <div class="stat-label">New This Month</div>
                <mat-progress-bar mode="determinate" [value]="(newUsersThisMonth / totalUsers) * 100"></mat-progress-bar>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <mat-card class="actions-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>flash_on</mat-icon>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="quick-actions">
            <button mat-raised-button color="primary" (click)="createEvent()">
              <mat-icon>add_circle</mat-icon>
              Create Event
            </button>
            <button mat-raised-button color="accent" (click)="manageUsers()">
              <mat-icon>group</mat-icon>
              Manage Users
            </button>
            <button mat-raised-button color="primary" (click)="viewReports()">
              <mat-icon>assessment</mat-icon>
              View Reports
            </button>
            <button mat-raised-button color="accent" (click)="editProfile()">
              <mat-icon>edit</mat-icon>
              Edit Profile
            </button>
            <button mat-raised-button color="warn" (click)="securitySettings()">
              <mat-icon>security</mat-icon>
              Security Settings
            </button>
            <button mat-raised-button color="primary" (click)="systemSettings()">
              <mat-icon>settings</mat-icon>
              System Settings
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      gap: 2rem;
    }

    .profile-card {
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .profile-header {
      text-align: center;
      padding: 2rem 0;
      background: linear-gradient(135deg, #6b8dd6 0%, #8e37d7 100%);
      color: white;
      border-radius: 15px 15px 0 0;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      margin: 0 auto 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4px solid white;
    }

    .avatar-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: white;
    }

    .role-chip {
      margin-top: 1rem;
    }

    .profile-info {
      padding: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .info-item mat-icon {
      color: #6b8dd6;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .stats-card {
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .stats-container {
      padding: 1rem;
      display: grid;
      gap: 1.5rem;
    }

    .stat-item {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #6b8dd6;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .actions-card {
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .quick-actions {
      padding: 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    mat-progress-bar {
      margin-top: 0.5rem;
      border-radius: 4px;
    }

    mat-card-title {
      font-size: 24px;
      margin-bottom: 0.5rem;
    }

    mat-card-subtitle {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.9);
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .profile-info {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminProfileComponent implements OnInit {
  userData: JwtResponse | null = null;
  eventsCreated: number = 0;
  activeEvents: number = 0;
  completedEvents: number = 0;
  totalUsers: number = 0;
  activeUsers: number = 0;
  newUsersThisMonth: number = 0;
  lastLogin: Date = new Date();

  constructor(
    private authService: AuthService,
    private statsService: StatsService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get user data without permission check
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        console.log('Current user data:', user);
        this.userData = user;
        this.lastLogin = new Date(); // In a real app, this would come from the backend
      },
      error: (error) => {
        console.error('Error getting user data:', error);
      }
    });

    // Get stats
    this.loadStats();
  }

  private loadStats(): void {
    this.statsService.getAdminStats().subscribe({
      next: (stats) => {
        console.log('Admin stats:', stats);
        this.eventsCreated = stats.totalEventsCreated;
        this.activeEvents = stats.activeEvents;
        this.totalUsers = stats.totalUsers;
        
        // Calculate additional stats
        this.completedEvents = this.eventsCreated - this.activeEvents;
        this.activeUsers = Math.round(this.totalUsers * 0.85); // Example calculation
        this.newUsersThisMonth = Math.round(this.totalUsers * 0.15); // Example calculation
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  createEvent() {
    this.router.navigate(['/events/create']);
  }

  manageUsers() {
    this.router.navigate(['/admin/users']);
  }

  viewReports() {
    this.router.navigate(['/admin/reports']);
  }

  editProfile() {
    this.router.navigate(['/admin/edit-profile']);
  }

  securitySettings() {
    this.router.navigate(['/admin/security']);
  }

  systemSettings() {
    this.router.navigate(['/admin/settings']);
  }
} 