import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <p>&copy; 2024 HelloEvents. All rights reserved.</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }

    .main-content {
      flex: 1;
      padding: 80px 20px 20px;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }

    .footer {
      background: #1976d2;
      color: white;
      text-align: center;
      padding: 16px;
      margin-top: auto;
    }

    .footer p {
      margin: 0;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 72px 16px 16px;
      }
    }
  `]
})
export class AppComponent {
  title = 'HelloEvents';
}
