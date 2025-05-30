import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventsService, Event } from '../../../services/events.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  numberOfTickets: number = 1;
  loading: boolean = false;
  error: string | null = null;
  private authService = inject(AuthService);
  private eventsService = inject(EventsService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  
  isAuthenticated$ = this.authService.isAuthenticated();

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(+eventId);
    }
  }

  private loadEvent(id: number): void {
    this.loading = true;
    this.error = null;

    this.eventsService.getEvent(id).subscribe({
      next: (event: Event) => {
        this.event = event;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading event:', error);
        this.error = error.message || 'Failed to load event';
        this.loading = false;
      }
    });
  }

  bookEvent(): void {
    if (!this.event || !this.numberOfTickets) {
      return;
    }

    if (this.numberOfTickets > this.event.availableSeats) {
      this.snackBar.open('Not enough seats available', 'Close', { duration: 3000 });
      return;
    }

    // TODO: Implement booking functionality with ReservationService
    this.snackBar.open('Booking functionality will be implemented soon', 'Close', { duration: 3000 });
  }
}
