import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface JwtResponse {
  id: number;
  username: string;
  email: string;
  roles: string[];
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<JwtResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<JwtResponse>(`${this.apiUrl}/auth/signin`, credentials, { headers }).pipe(
      tap(response => {
        // Store user data
        const user: User = {
          id: response.id,
          username: response.username,
          email: response.email,
          roles: response.roles,
          token: response.token
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }),
      switchMap(response => {
        // Handle redirection with replaceUrl: true
        if (response.roles.includes('ROLE_ADMIN')) {
          return this.router.navigate(['/admin/dashboard'], { replaceUrl: true }).then(() => response);
        } else {
          return this.router.navigate(['/client/dashboard'], { replaceUrl: true }).then(() => response);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error(error.error?.message || 'Invalid username or password'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  signup(userData: SignupRequest): Observable<JwtResponse> {
    const formattedData = {
      ...userData,
      role: userData.role.replace('ROLE_', '')
    };

    return this.http.post<JwtResponse>(`${this.apiUrl}/auth/signup`, formattedData).pipe(
      catchError(error => {
        console.error('Signup error:', error);
        if (error.error?.message) {
          return throwError(() => new Error(error.error.message));
        } else if (error.status === 409) {
          return throwError(() => new Error('Username or email already exists'));
        } else {
          return throwError(() => new Error('Registration failed. Please try again.'));
        }
      })
    );
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.roles.includes(role) || false;
  }

  getAuthToken(): string | null {
    const user = this.currentUserSubject.value;
    return user?.token || null;
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  isClient(): boolean {
    return this.hasRole('ROLE_CLIENT');
  }
}