import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registeredUsers?: number;
  availableSeats: number;
  status?: string;
  createdBy?: number;
  creatorUsername?: string;
  price?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Get all events
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`);
  }

  // Get recent events (for admin dashboard)
  getRecentEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events/recent`);
  }

  // Get user's registered events
  getUserEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events/user`);
  }

  // Get single event
  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/events/${id}`);
  }

  // Create new event
  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events`, event);
  }

  // Update event
  updateEvent(id: number, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${id}`, event);
  }

  // Delete event
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${id}`);
  }

  // Register for an event
  registerForEvent(eventId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/events/${eventId}/register`, {});
  }

  // Unregister from an event
  unregisterFromEvent(eventId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/events/${eventId}/register`);
  }
}