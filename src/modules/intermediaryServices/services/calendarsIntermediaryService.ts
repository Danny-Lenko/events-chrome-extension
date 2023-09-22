import { Event } from '../types/intermediaryTypes';
import { CalendarIntermediaryInterface } from '../types/intermediaryInterfaces';

export class CalendarIntermediaryService
   implements CalendarIntermediaryInterface
{
   constructor() {}

   public async postEvents(events: Event[]): Promise<void> {
      if (!events.length) return;

      const reqBody = JSON.stringify(events);
      try {
         const res = await fetch('http://localhost:8080/add-events', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/JSON',
            },
            body: reqBody,
         });
         if (!res.ok) {
            throw new Error('Request failed with status: ' + res.status);
         }
         const resData = await res.json();
         console.log(resData);
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   }

   public async deleteEvent(event: Event): Promise<void> {
      const reqBody = JSON.stringify(event);

      try {
         const res = await fetch('http://localhost:8080/delete-event', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/JSON',
            },
            body: reqBody,
         });
         if (!res.ok) {
            throw new Error('Request failed with status: ' + res.status);
         }
         const resData = await res.json();
         console.log(resData);
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   }
}
