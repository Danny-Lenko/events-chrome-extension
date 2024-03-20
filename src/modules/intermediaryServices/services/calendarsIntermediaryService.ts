import { Event } from '../types/intermediaryTypes';
import { CalendarIntermediaryInterface } from '../types/intermediaryInterfaces';

const baseUrl = process.env.BACKEND_URL;

console.log('BASEURL:', baseUrl);

export class CalendarIntermediaryService
   implements CalendarIntermediaryInterface
{
   constructor() {}

   public async postEvents(events: Event[]): Promise<void> {
      if (!events.length) return;

      const reqBody = JSON.stringify(events);
      try {
         const res = await fetch(`${baseUrl}/add-events`, {
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
         const res = await fetch(`${baseUrl}/delete-event`, {
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

   public findExtraObjects(
      previousState: Event[],
      currentState: Event[],
   ): Event[] {
      const notInCurrentState = [];

      for (const prevObject of previousState) {
         const existsInCurrentState = currentState.some((currObject) => {
            return this.compareObjects(prevObject, currObject);
         });

         if (!existsInCurrentState) {
            notInCurrentState.push(prevObject);
         }
      }

      return notInCurrentState;
   }

   private compareObjects(obj1: Event, obj2: Event): boolean {
      return (
         obj1.end === obj2.end &&
         obj1.start === obj2.start &&
         obj1.summary === obj2.summary
      );
   }

   public async updateStorageState(storageIndex: string, events: Event[]) {
      await chrome.storage.local.set({ [storageIndex]: events }, () => {});
      await chrome.storage.local.get(async (storageData) => {
         const events = await storageData;
         console.log(events);
      });
   }

   public async getStorageState(storageIndex: string) {
      return new Promise<Event[]>((resolve, reject) => {
         chrome.storage.local.get(storageIndex, async (storageData) => {
            if (chrome.runtime.lastError) {
               reject(chrome.runtime.lastError);
               return;
            }

            const events = await storageData[storageIndex];

            if (!events) {
               this.updateStorageState(storageIndex, []);
               // reject('No events yet');
               return;
            }

            resolve(events);
         });
      });
   }

   public async clearStorage(storageIndex: string) {
      await chrome.storage.local.remove(storageIndex);
   }
}
