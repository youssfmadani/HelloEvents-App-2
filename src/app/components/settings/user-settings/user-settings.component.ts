import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="settings-container">
      <h1>Account Settings</h1>

      <mat-card class="settings-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>lock</mat-icon>
          <mat-card-title>Change Password</mat-card-title>
          <mat-card-subtitle>Update your account password</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Current Password</mat-label>
              <input matInput type="password" formControlName="currentPassword" required>
              <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                Current password is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>New Password</mat-label>
              <input matInput type="password" formControlName="newPassword" required>
              <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                New password is required
              </mat-error>
              <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                Password must be at least 6 characters long
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Confirm New Password</mat-label>
              <input matInput type="password" formControlName="confirmPassword" required>
              <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                Password confirmation is required
              </mat-error>
              <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="passwordForm.invalid">
                Update Password
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="settings-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>notifications</mat-icon>
          <mat-card-title>Notification Settings</mat-card-title>
          <mat-card-subtitle>Manage your notification preferences</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="notificationForm" (ngSubmit)="onNotificationSubmit()">
            <div class="notification-options">
              <mat-checkbox formControlName="emailNotifications">
                Receive email notifications
              </mat-checkbox>
              <mat-checkbox formControlName="eventReminders">
                Event reminders
              </mat-checkbox>
              <mat-checkbox formControlName="marketingEmails">
                Marketing emails
              </mat-checkbox>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="notificationForm.invalid">
                Save Preferences
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: 2rem;
      color: #333;
    }

    .settings-card {
      margin-bottom: 2rem;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }

    .notification-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    @media (max-width: 600px) {
      .settings-container {
        padding: 1rem;
      }
    }
  `]
})
export class UserSettingsComponent implements OnInit {
  passwordForm: FormGroup;
  notificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      eventReminders: [true],
      marketingEmails: [false]
    });
  }

  ngOnInit(): void {
    // Load user settings if available
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      // TODO: Implement password change functionality
      this.snackBar.open('Password change functionality will be implemented soon', 'Close', {
        duration: 3000
      });
    }
  }

  onNotificationSubmit(): void {
    if (this.notificationForm.valid) {
      // TODO: Implement notification settings update
      this.snackBar.open('Notification settings update will be implemented soon', 'Close', {
        duration: 3000
      });
    }
  }
} 