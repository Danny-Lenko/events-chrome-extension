import {
   MicroCalendarFormattingInterface,
   MicroCalendarInterface,
} from '../types/microCalendarInterfaces';
import { Event } from '../../intermediaryServices/types/intermediaryTypes';
import { ServiceDecorator } from '../../../core/decorators/ServiceDecorator';
import { MicroCalendarFormattingService } from './microCalendarFormattingService';
import { CalendarIntermediaryInterface } from '../../intermediaryServices/types/intermediaryInterfaces';
import { CalendarIntermediaryService } from '../../intermediaryServices/services/calendarsIntermediaryService';

@ServiceDecorator
export class MicroCalendarService implements MicroCalendarInterface {
   private events: Event[];
   private storageIndex: string = 'microEvents';

   private readonly observerTargetNode: HTMLElement = document.body;
   private readonly observerConfig: Record<string, boolean> = {
      childList: true,
      subtree: true,
   };

   constructor(
      public FormattingService: MicroCalendarFormattingInterface = new MicroCalendarFormattingService(),
      public IntermediaryService: CalendarIntermediaryInterface = new CalendarIntermediaryService(),
   ) {}

   private observer = new MutationObserver(async () => {
      const currentStateEvents = this.getAndFormatEvents();
      const previousStateEvents =
         await this.IntermediaryService.getStorageState(this.storageIndex);

      const extraEvents = this.IntermediaryService.findExtraObjects(
         previousStateEvents,
         currentStateEvents,
      );

      if (extraEvents.length) {
         for (const event of extraEvents) {
            await this.IntermediaryService.deleteEvent(event);
         }
      }

      await this.IntermediaryService.postEvents(currentStateEvents);
      this.IntermediaryService.updateStorageState(
         this.storageIndex,
         currentStateEvents,
      );
   });

   private getAndFormatEvents() {
      const localEvents = [];
      this.events = [];

      const elements = document.querySelectorAll(
         '[role="button"][title][aria-label^="event "]',
      );

      for (const element of Array.from(elements)) {
         const content = this.FormattingService.editLikeGoogleApiWants(
            element.ariaLabel,
         );

         if (!content) return;
         this.events.push(content);
         localEvents.push(content);
      }

      return localEvents;
   }

   run() {
      console.log('Micro Calendar service is working ---------------------!');

      return this.observer.observe(
         this.observerTargetNode,
         this.observerConfig,
      );
   }
}
