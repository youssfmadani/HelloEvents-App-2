import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventsService, Event } from '../../../services/events.service';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  loading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private eventsService: EventsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvents(): void {
    if (this.loading) return;
    
    this.loading = true;
    this.error = null;

    this.eventsService.getAllEvents()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (events: Event[]) => {
          this.events = events;
        },
        error: (error: { message?: string }) => {
          console.error('Error loading events:', error);
          const errorMessage = error.message || 'Failed to load events';
          this.error = errorMessage;
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        }
      });
  }

  deleteEvent(eventId: number): void {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    this.eventsService.deleteEvent(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.events = this.events.filter(e => e.id !== eventId);
          this.snackBar.open('Event deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error: { message?: string }) => {
          console.error('Error deleting event:', error);
          this.snackBar.open('Failed to delete event', 'Close', { duration: 3000 });
        }
      });
  }

  trackByEventId(index: number, event: Event): number {
    return event.id || index;
  }
}
