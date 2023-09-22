import { MicroCalendarStateInterface } from '../types/microCalendarInterfaces';
import { Event } from '../../intermediaryServices/types/intermediaryTypes';

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

      console.log('Not in current state:', notInCurrentState);
      return notInCurrentState;
   }

   private compareObjects(obj1: Event, obj2: Event): boolean {
      return (
         obj1.end === obj2.end &&
         obj1.start === obj2.start &&
         obj1.summary === obj2.summary
      );
   }

   public updateStorageState(events: Event[]) {
      chrome.storage.local.set({ microEvents: events }, () => {});
   }

   public getStorageState() {
      // this.clearStorate();

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

   public async clearStorate() {
      await chrome.storage.local.remove('microEvents');
      console.log('storage has been cleared');
   }
}
