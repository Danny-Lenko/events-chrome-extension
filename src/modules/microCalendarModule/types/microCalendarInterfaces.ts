import { GeneralServiceInterface } from '../../../core/coreInterfaces';

export interface MicroCalendarInterface extends GeneralServiceInterface {
   run(): void;
}

export interface MicroCalendarFormattingInterface
   extends GeneralServiceInterface {
   editLikeGoogleApiWants(nodeContent: string): Event;
}

export interface MicroCalendarApiInterface extends GeneralServiceInterface {
   postEvents(events: Event[]): Promise<void>;
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

export interface Event {
   colorId: string;
   description: string;
   end: string;
   organizer: string;
   start: string;
   status: string;
}
