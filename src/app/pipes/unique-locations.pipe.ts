import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../services/events.service';

@Pipe({
  name: 'uniqueLocations',
  standalone: true
})
export class UniqueLocationsPipe implements PipeTransform {
  transform(events: Event[]): string[] {
    return [...new Set(events.map(event => event.location))];
  }
}