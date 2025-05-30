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
import { StatsService, ClientStats } from '../../../services/stats.service';
import { JwtResponse } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-profile',
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
    <div class="profile-container">
      <mat-card class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <mat-icon class="avatar-icon">account_circle</mat-icon>
          </div>
          <mat-card-title>{{ userData?.username }}</mat-card-title>
          <mat-card-subtitle>Client</mat-card-subtitle>
          <div class="role-chip">
            <mat-chip-set>
              <mat-chip color="accent" selected>CLIENT</mat-chip>
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
          </div>

          <div class="stats-container">
            <mat-card class="stat-card">
              <div class="stat-value">{{ eventsCreated }}</div>
              <div class="stat-label">Events Created</div>
            </mat-card>
            <mat-card class="stat-card">
              <div class="stat-value">{{ activeEvents }}</div>
              <div class="stat-label">Active Events</div>
            </mat-card>
          </div>

          <div class="quick-actions">
            <button mat-raised-button color="primary" (click)="viewEvents()">
              <mat-icon>event</mat-icon>
              View Events
            </button>
            <button mat-raised-button color="accent" (click)="editProfile()">
              <mat-icon>edit</mat-icon>
              Edit Profile
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
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
    }

    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .info-item mat-icon {
      color: #6b8dd6;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 0 2rem 2rem;
    }

    .stat-card {
      padding: 1rem;
      text-align: center;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #6b8dd6;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      margin-top: 0.5rem;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 0 2rem 2rem;
    }

    .quick-actions button {
      width: 100%;
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
      .stats-container,
      .quick-actions {
        grid-template-columns: 1fr;
      }

      .profile-container {
        padding: 1rem;
      }
    }
  `]
})
export class ClientProfileComponent implements OnInit {
  userData: JwtResponse | null = null;
  eventsCreated: number = 0;
  activeEvents: number = 0;

  constructor(
    private authService: AuthService,
    private statsService: StatsService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get user data
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.userData = user;
        if (!user || !user.roles.includes('CLIENT')) {
          this.router.navigate(['/unauthorized']);
          return;
        }
      },
      error: () => {
        this.router.navigate(['/unauthorized']);
      }
    });

    // Get stats
    this.loadStats();
  }

  private loadStats(): void {
    this.statsService.getClientStats().subscribe({
      next: (stats: ClientStats) => {
        this.eventsCreated = stats.registeredEvents;
        this.activeEvents = stats.upcomingEvents;
      },
      error: (error: { message?: string }) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  viewEvents() {
    this.router.navigate(['/events']);
  }

  editProfile() {
    // TODO: Implement edit profile functionality
    console.log('Edit profile clicked');
  }
} 