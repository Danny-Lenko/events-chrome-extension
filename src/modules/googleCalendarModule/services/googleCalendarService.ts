import {
   GoogleCalendarFormattingInterface,
   GoogleCalendarInterface,
} from '../types/googleCalendarInterfaces';
import { ServiceDecorator } from '../../../core/decorators/ServiceDecorator';
import { Event } from '../../intermediaryServices/types/intermediaryTypes';
import { GoogleCalendarFormattingService } from './googleCalendarFormattingService';

@ServiceDecorator
export class GoogleCalendarService implements GoogleCalendarInterface {
   private readonly observerTargetNode: HTMLElement = document.body;
   private readonly observerConfig: Record<string, boolean> = {
      childList: true,
      subtree: true,
   };

   constructor(
      public FormattingService: GoogleCalendarFormattingInterface = new GoogleCalendarFormattingService(),
   ) {}

   private observer = new MutationObserver(async () => {
      const currentStateEvents = this.getAndFormatEvents();
      console.log(currentStateEvents);
   });

   private getAndFormatEvents() {
      const localEvents: Event[] = [];

      Array.from(document.getElementsByClassName('ynRLnc'))
         .filter((node) => {
            const content = node.innerHTML.split(', ');
            return (
               content.length >= 5 &&
               !content[2].match(/^calendar:/i) &&
               !content[1].match(/^No title/i)
            );
         })
         .forEach((node) => {
            const content = this.FormattingService.editAsGoogleApiWants(
               node.innerHTML,
            );
            if (!content) return;
            localEvents.push(content);
         });
      return localEvents;
   }

   run() {
      console.log('Calendar service is working ---------------------!');

      return this.observer.observe(
         this.observerTargetNode,
         this.observerConfig,
      );
   }
}
