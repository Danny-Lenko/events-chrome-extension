import { GeneralServiceInterface } from '../../../core/coreInterfaces';
import { Event } from './intermediaryTypes';

export interface RulesIntermediaryInterface extends GeneralServiceInterface {
   getRules(): Promise<{
      adminEmail: string;
      emailServices: {
         filterString: string;
      };
   }>;
}

export interface CalendarIntermediaryInterface extends GeneralServiceInterface {
   postEvents(events: Event[]): Promise<void>;
}
