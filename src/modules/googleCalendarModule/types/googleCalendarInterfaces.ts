import { GeneralServiceInterface } from '../../../core/coreInterfaces';
import { Event } from '../../intermediaryServices/types/intermediaryTypes';

export interface GoogleCalendarInterface extends GeneralServiceInterface {
   run(): void;
}

export interface GoogleCalendarFormattingInterface
   extends GeneralServiceInterface {
   editAsGoogleApiWants(nodeContent: string): Event;
}

export interface AllInterfaces {
   // interfaces needed to run module
   interfaces: {
      GoogleCalendarInterface: GoogleCalendarInterface;
   };
}
