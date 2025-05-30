import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventsService, Event } from '../../../services/events.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Event' : 'Create New Event' }}</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Event title">
              <mat-error *ngIf="eventForm.get('title')?.errors?.['required']">Title is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="4" placeholder="Event description"></textarea>
              <mat-error *ngIf="eventForm.get('description')?.errors?.['required']">Description is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
              <mat-error *ngIf="eventForm.get('date')?.errors?.['required']">Date is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Location</mat-label>
              <input matInput formControlName="location" placeholder="Event location">
              <mat-error *ngIf="eventForm.get('location')?.errors?.['required']">Location is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Price</mat-label>
              <input matInput type="number" formControlName="price" placeholder="Event price">
              <mat-error *ngIf="eventForm.get('price')?.errors?.['required']">Price is required</mat-error>
              <mat-error *ngIf="eventForm.get('price')?.errors?.['min']">Price cannot be negative</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Available Seats</mat-label>
              <input matInput type="number" formControlName="availableSeats" placeholder="Number of available seats">
              <mat-error *ngIf="eventForm.get('availableSeats')?.errors?.['required']">Available seats is required</mat-error>
              <mat-error *ngIf="eventForm.get('availableSeats')?.errors?.['min']">Must be at least 1 seat</mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/events">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="eventForm.invalid || loading">
                <mat-icon>{{ isEditMode ? 'save' : 'add' }}</mat-icon>
                {{ isEditMode ? 'Update Event' : 'Create Event' }}
              </button>
            </div>
          </form>

          <div class="loading-spinner" *ngIf="loading">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
    }

    @media (max-width: 600px) {
      .form-container {
        padding: 1rem;
      }
    }
  `]
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  loading = false;
  eventId: number | null = null;
  event: Event | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      availableSeats: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.eventId = +id;
      this.loadEvent(this.eventId);
    }
  }

  loadEvent(id: number): void {
    this.loading = true;
    this.error = null;

    this.eventsService.getEvent(id).subscribe({
      next: (event: Event) => {
        this.event = event;
        this.initForm(event);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading event:', error);
        this.error = error.message || 'Failed to load event';
        this.loading = false;
        this.snackBar.open('Error loading event details', 'Close', { duration: 3000 });
      }
    });
  }

  initForm(event: Event): void {
    this.eventForm.patchValue({
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      location: event.location,
      price: event.price,
      availableSeats: event.availableSeats
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid && !this.loading) {
      this.loading = true;
      const eventData = {
        ...this.eventForm.value,
        date: new Date(this.eventForm.value.date).toISOString()
      };

      const request = this.isEditMode && this.eventId
        ? this.eventsService.updateEvent(this.eventId, eventData)
        : this.eventsService.createEvent(eventData);

      request.subscribe({
        next: () => {
          const message = this.isEditMode ? 'Event updated successfully' : 'Event created successfully';
          this.snackBar.open(message, 'Close', { duration: 3000 });
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Error saving event:', error);
          this.loading = false;
          this.snackBar.open('Failed to save event', 'Close', { duration: 3000 });
        }
      });
    }
  }
} 