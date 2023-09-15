import {
   MicroCalendarStateInterface,
   Event,
} from '../types/microCalendarInterfaces';

export class MicroCalendarStateService implements MicroCalendarStateInterface {
   constructor() {}

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
         obj1.description === obj2.description
      );
   }

   public updateStorageState(events: Event[]) {
      chrome.storage.local.set({ microEvents: events }, () => {
         console.log('Storage events got updated');
      });
   }

   public getStorageState() {
      console.log('storage reached');

      return new Promise<Event[]>((resolve, reject) => {
         chrome.storage.local.get('microEvents', async (storageData) => {
            if (chrome.runtime.lastError) {
               reject(chrome.runtime.lastError);
               return;
            }

            const events = await storageData.microEvents;

            if (!events) {
               this.updateStorageState([]);
               reject('No micro event yet');
               return;
            }

            resolve(events);
         });
      });
   }

   public clearStorate() {
      chrome.storage.local.remove('microEvents');
   }
}
