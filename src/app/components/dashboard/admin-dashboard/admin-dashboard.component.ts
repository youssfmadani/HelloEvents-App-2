import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { EventsService, Event } from '../../../services/events.service';
import { StatsService, AdminStats } from '../../../services/stats.service';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar>admin_panel_settings</mat-icon>
            <mat-card-title>Welcome, {{ username }}</mat-card-title>
            <mat-card-subtitle>Administrator Dashboard</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Manage events, users, and system settings from this dashboard.</p>
          </mat-card-content>
          <mat-card-actions>
            <a mat-raised-button color="primary" routerLink="/admin/events/create">
              <mat-icon>add_circle</mat-icon>
              Create New Event
            </a>
            <a mat-button color="accent" routerLink="/admin/events">
              <mat-icon>view_list</mat-icon>
              View All Events
            </a>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar>event</mat-icon>
            <mat-card-title>Events Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-container">
              <div class="stat">
                <span class="stat-value">{{ stats.totalEventsCreated }}</span>
                <span class="stat-label">Total Events</span>
              </div>
              <div class="stat">
                <span class="stat-value">{{ stats.activeEvents }}</span>
                <span class="stat-label">Active Events</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar>group</mat-icon>
            <mat-card-title>Users Overview</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-container">
              <div class="stat">
                <span class="stat-value">{{ stats.totalUsers }}</span>
                <span class="stat-label">Total Users</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Events Management -->
      <mat-card class="events-management">
        <mat-card-header>
          <mat-icon mat-card-avatar>event_note</mat-icon>
          <mat-card-title>Events Management</mat-card-title>
          <mat-card-subtitle>Create, edit, and manage events</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="events-table-container">
            <table class="events-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let event of recentEvents">
                  <td>{{ event.title }}</td>
                  <td>{{ event.date | date }}</td>
                  <td>
                    <span [class]="'status-badge ' + getEventStatus(event)">
                      {{ getEventStatus(event) }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <button mat-icon-button [matMenuTriggerFor]="eventMenu">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #eventMenu="matMenu">
                      <a mat-menu-item [routerLink]="['/admin/events', event.id]">
                        <mat-icon>visibility</mat-icon>
                        <span>View Details</span>
                      </a>
                      <a mat-menu-item [routerLink]="['/admin/events/edit', event.id]">
                        <mat-icon>edit</mat-icon>
                        <span>Edit Event</span>
                      </a>
                      <button mat-menu-item (click)="deleteEvent(event.id)">
                        <mat-icon color="warn">delete</mat-icon>
                        <span class="text-warn">Delete</span>
                      </button>
                    </mat-menu>
                  </td>
                </tr>
              </tbody>
            </table>
            <div *ngIf="recentEvents.length === 0" class="no-events">
              <p>No events found. Create your first event!</p>
              <a mat-raised-button color="primary" routerLink="/admin/events/create">
                <mat-icon>add_circle</mat-icon>
                Create Event
              </a>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <a mat-button color="primary" routerLink="/admin/events">
            View All Events
          </a>
        </mat-card-actions>
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

    .welcome-section mat-card {
      background: linear-gradient(135deg, #673ab7, #9c27b0);
      color: white;
    }

    .welcome-section mat-card-title,
    .welcome-section mat-card-subtitle,
    .welcome-section p {
      color: white;
    }

    .welcome-section mat-card-actions {
      display: flex;
      gap: 1rem;
      padding: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }

    .stat {
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #673ab7;
      display: block;
    }

    .stat-label {
      font-size: 1rem;
      color: #666;
    }

    .events-table-container {
      overflow-x: auto;
    }

    .events-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .events-table th,
    .events-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .events-table th {
      font-weight: 500;
      color: #666;
      background: #f5f5f5;
    }

    .actions-cell {
      width: 48px;
      text-align: center;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.upcoming {
      background: #e3f2fd;
      color: #1565c0;
    }

    .status-badge.completed {
      background: #f5f5f5;
      color: #616161;
    }

    .no-events {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .text-warn {
      color: #f44336;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .welcome-section mat-card-actions {
        flex-direction: column;
      }

      .welcome-section mat-card-actions a {
        width: 100%;
      }

      .events-table th,
      .events-table td {
        padding: 0.5rem;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  username = '';
  stats: AdminStats = {
    totalEventsCreated: 0,
    activeEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0
  };
  recentEvents: Event[] = [];

  constructor(
    private authService: AuthService,
    private eventsService: EventsService,
    private statsService: StatsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.username = user.username;
      }
    });

    this.loadStats();
    this.loadRecentEvents();
  }

  private loadStats(): void {
    this.statsService.getAdminStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.snackBar.open('Error loading dashboard statistics', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private loadRecentEvents(): void {
    this.eventsService.getRecentEvents().subscribe({
      next: (events) => {
        this.recentEvents = events;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.snackBar.open('Error loading recent events', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  getEventStatus(event: Event): string {
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (eventDate < now) {
      return 'completed';
    } else if (eventDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      return 'active';
    } else {
      return 'upcoming';
    }
  }

  deleteEvent(id: number | undefined): void {
    if (!id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Event',
        message: 'Are you sure you want to delete this event? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventsService.deleteEvent(id).subscribe({
          next: () => {
            this.snackBar.open('Event deleted successfully', 'Close', {
              duration: 3000
            });
            this.loadRecentEvents();
            this.loadStats();
          },
          error: (error) => {
            console.error('Error deleting event:', error);
            this.snackBar.open('Error deleting event', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
} 