import { GeneralServiceInterface } from '../../../core/coreInterfaces';
import { Event } from '../../intermediaryServices/types/intermediaryTypes';

export interface MicroCalendarInterface extends GeneralServiceInterface {
   run(): void;
}

export interface MicroCalendarFormattingInterface
   extends GeneralServiceInterface {
   editLikeGoogleApiWants(nodeContent: string): Event;
}

export interface MicroCalendarStateInterface extends GeneralServiceInterface {
   findExtraObjects(previousState: Event[], currentState: Event[]): Event[];
   getStorageState(): Promise<Event[]>;
   updateStorageState(events: Event[]): void;
}

export interface AllInterfaces {
   // interfaces needed to run module
   interfaces: {
      MicroCalendarInterface: MicroCalendarInterface;
   };
}
