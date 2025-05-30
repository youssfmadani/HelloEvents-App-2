import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { EventsService, Event } from '../../../services/events.service';
import { StatsService, ClientStats } from '../../../services/stats.service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Welcome Section -->
      <mat-card class="welcome-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>person</mat-icon>
          <mat-card-title>Welcome, {{ username }}</mat-card-title>
          <mat-card-subtitle>Client Dashboard</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="stats-container">
            <div class="stat">
              <span class="stat-value">{{ stats.registeredEvents }}</span>
              <span class="stat-label">Registered Events</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.upcomingEvents }}</span>
              <span class="stat-label">Upcoming Events</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.pastEvents }}</span>
              <span class="stat-label">Past Events</span>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="../events">
            <mat-icon>event</mat-icon>
            Browse Events
          </button>
        </mat-card-actions>
      </mat-card>

      <!-- Registered Events -->
      <mat-card class="events-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>event_note</mat-icon>
          <mat-card-title>My Registered Events</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="registeredEvents" class="events-table" *ngIf="registeredEvents.length > 0">
            <!-- Title Column -->
            <ng-container matColumnDef="title">
              <th mat-header-cell *matHeaderCellDef>Title</th>
              <td mat-cell *matCellDef="let event">{{ event.title }}</td>
            </ng-container>

            <!-- Date Column -->
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let event">{{ event.date | date }}</td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let event">
                <span [class]="'status-badge ' + getEventStatus(event)">
                  {{ getEventStatus(event) }}
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let event">
                <button mat-icon-button color="primary" [routerLink]="['../events', event.id]">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="unregisterFromEvent(event.id)" *ngIf="getEventStatus(event) === 'upcoming'">
                  <mat-icon>event_busy</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <div *ngIf="registeredEvents.length === 0" class="no-events">
            <p>You haven't registered for any events yet.</p>
            <button mat-raised-button color="primary" routerLink="../events">
              Browse Events
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      gap: 20px;
    }

    .welcome-card {
      background: linear-gradient(135deg, #1976d2, #64b5f6);
      color: white;
    }

    .welcome-card mat-card-title,
    .welcome-card mat-card-subtitle {
      color: white;
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }

    .stat {
      text-align: center;
      padding: 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }

    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      opacity: 0.9;
    }

    .events-table {
      width: 100%;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .status-badge.active {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.upcoming {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .status-badge.completed {
      background-color: #f5f5f5;
      color: #616161;
    }

    .no-events {
      text-align: center;
      padding: 40px;
    }

    mat-card-actions {
      padding: 16px;
      display: flex;
      justify-content: flex-end;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  username = '';
  stats: ClientStats = {
    registeredEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0
  };
  registeredEvents: Event[] = [];
  displayedColumns = ['title', 'date', 'status', 'actions'];
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private eventsService: EventsService,
    private statsService: StatsService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    forkJoin({
      user: this.authService.getCurrentUser(),
      stats: this.statsService.getClientStats(),
      events: this.eventsService.getUserEvents()
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ user, stats, events }) => {
        if (user) {
          this.username = user.username;
        }
        this.stats = stats;
        this.registeredEvents = events;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.snackBar.open('Error loading dashboard data', 'Close', {
          duration: 5000
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

  unregisterFromEvent(eventId: number): void {
    this.eventsService.unregisterFromEvent(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Successfully unregistered from event', 'Close', {
            duration: 3000
          });
          this.loadDashboardData();
        },
        error: (error) => {
          console.error('Error unregistering from event:', error);
          this.snackBar.open(error.message || 'Failed to unregister from event', 'Close', {
            duration: 5000
          });
        }
      });
  }
} 