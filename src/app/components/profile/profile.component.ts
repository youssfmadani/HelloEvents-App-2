import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>Profile</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="profile-info" *ngIf="currentUser">
            <p><strong>Username:</strong> {{currentUser.username}}</p>
            <p><strong>Email:</strong> {{currentUser.email}}</p>
            <p><strong>Role:</strong> Admin</p>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Back to Dashboard
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }
    .profile-card {
      width: 100%;
    }
    .profile-info {
      margin: 1rem 0;
    }
    .profile-info p {
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }
    mat-card-actions {
      padding: 1rem;
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}