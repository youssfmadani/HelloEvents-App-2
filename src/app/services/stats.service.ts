import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminStats {
  totalEventsCreated: number;
  activeEvents: number;
  totalUsers: number;
  totalRegistrations: number;
}

export interface ClientStats {
  registeredEvents: number;
  upcomingEvents: number;
  pastEvents: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get admin dashboard statistics
  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats/admin`);
  }

  // Get client dashboard statistics
  getClientStats(): Observable<ClientStats> {
    return this.http.get<ClientStats>(`${this.apiUrl}/stats/client`);
  }
} 