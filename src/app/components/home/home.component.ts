import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="home-container">
      <section class="hero">
        <div class="hero-content">
          <h1>Welcome to HelloEvents</h1>
          <p>Discover and book amazing events or create your own!</p>
          <div class="hero-buttons">
            <a mat-raised-button color="primary" routerLink="/register">
              <mat-icon>person_add</mat-icon>
              Get Started
            </a>
            <a mat-raised-button color="accent" routerLink="/events">
              <mat-icon>event</mat-icon>
              Browse Events
            </a>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="feature-card">
          <mat-icon>event_available</mat-icon>
          <h3>Book Events</h3>
          <p>Find and reserve your spot at exciting events near you.</p>
        </div>
        <div class="feature-card">
          <mat-icon>add_circle</mat-icon>
          <h3>Create Events</h3>
          <p>Host your own events and manage them with ease.</p>
        </div>
        <div class="feature-card">
          <mat-icon>people</mat-icon>
          <h3>Connect</h3>
          <p>Join a community of event enthusiasts.</p>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: calc(100vh - 64px);
      padding-top: 64px;
    }

    .hero {
      background: linear-gradient(135deg, #1976d2, #64b5f6);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .hero p {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-card mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      color: #1976d2;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .feature-card p {
      color: #666;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .hero p {
        font-size: 1.2rem;
      }

      .hero-buttons {
        flex-direction: column;
      }

      .features {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class HomeComponent {}
