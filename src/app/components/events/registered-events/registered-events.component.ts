import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventsService, Event } from '../../../services/events.service';

@Component({
  selector: 'app-registered-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="registered-events-container">
      <h1>My Registered Events</h1>

      <!-- Loading spinner -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading your events...</p>
      </div>

      <!-- Error message -->
      <div class="error-container" *ngIf="error">
        <p class="error-message">{{error}}</p>
        <button mat-raised-button color="primary" (click)="loadEvents()">Try Again</button>
      </div>

      <!-- Events grid -->
      <div class="events-grid" *ngIf="!loading && !error && events.length > 0">
        <mat-card *ngFor="let event of events" class="event-card">
          <mat-card-header>
            <mat-card-title>{{event.title}}</mat-card-title>
            <mat-card-subtitle>{{event.location}}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="event-details">
              <p><mat-icon>calendar_today</mat-icon> {{event.date | date:'medium'}}</p>
              <p><mat-icon>attach_money</mat-icon> {{event.price | currency}}</p>
              <p><mat-icon>person</mat-icon> Organized by: {{event.creatorUsername}}</p>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button [routerLink]="['/client/events', event.id]">
              <mat-icon>visibility</mat-icon>
              View Details
            </button>
            <button mat-button color="warn" (click)="unregisterFromEvent(event.id!)" *ngIf="getEventStatus(event) === 'upcoming'">
              <mat-icon>event_busy</mat-icon>
              Unregister
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- No events message -->
      <div class="no-events" *ngIf="!loading && !error && events.length === 0">
        <p>You haven't registered for any events yet.</p>
        <button mat-raised-button color="primary" routerLink="/client/events">
          Browse Events
        </button>
      </div>
    </div>
  `,
  styles: [`
    .registered-events-container {
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 2rem;
      color: #333;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      gap: 1rem;
    }

    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      gap: 1rem;
    }

    .error-message {
      color: #f44336;
      font-size: 1.1rem;
    }

    .events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1rem 0;
    }

    .event-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .event-details {
      margin-top: 1rem;
    }

    .event-details p {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0;
    }

    .no-events {
      text-align: center;
      padding: 2rem;
      background: #f5f5f5;
      border-radius: 8px;
      margin-top: 2rem;
    }

    .no-events p {
      margin-bottom: 1rem;
      font-size: 1.2rem;
      color: #666;
    }

    @media (max-width: 600px) {
      .events-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisteredEventsComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private eventsService: EventsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    this.eventsService.getUserEvents()
      .subscribe({
        next: (events) => {
          this.events = events;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading events:', error);
          this.error = error.message || 'Failed to load your registered events';
          this.loading = false;
        }
      });
  }

  unregisterFromEvent(eventId: number): void {
    this.eventsService.unregisterFromEvent(eventId)
      .subscribe({
        next: () => {
          this.snackBar.open('Successfully unregistered from event', 'Close', {
            duration: 3000
          });
          this.loadEvents();
        },
        error: (error) => {
          console.error('Error unregistering from event:', error);
          this.snackBar.open(error.message || 'Failed to unregister from event', 'Close', {
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
} 