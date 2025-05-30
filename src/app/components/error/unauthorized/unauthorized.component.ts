import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <mat-card-header>
          <mat-icon color="warn">error</mat-icon>
          <mat-card-title>Unauthorized Access</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Sorry, you don't have permission to access this page.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goToLogin()">
            <mat-icon>login</mat-icon>
            Go to Login
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
      text-align: center;
    }
    .unauthorized-card {
      width: 100%;
    }
    mat-card-header {
      justify-content: center;
      margin-bottom: 1rem;
    }
    mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      margin-right: 1rem;
    }
    mat-card-title {
      margin-top: 0.5rem;
      color: #f44336;
    }
    mat-card-content {
      font-size: 1.1rem;
      margin: 1rem 0;
    }
    mat-card-actions {
      justify-content: center;
      padding: 1rem;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 