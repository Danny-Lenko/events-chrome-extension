import { Event } from '../../intermediaryServices/types/intermediaryTypes';
import { GoogleCalendarFormattingInterface } from '../types/googleCalendarInterfaces';

export class GoogleCalendarFormattingService
   implements GoogleCalendarFormattingInterface
{
   private googlePrefix: string = 'gl: ';

   constructor() {}

   public editAsGoogleApiWants(nodeContent: string): Event {
      const content = nodeContent.split(', ');

      const match = content[3].match(/needs rsvp/i);

      const invitation = match && match.length > 0;

      const originalDate =
         content[content.length - 2] + ', ' + content[content.length - 1];

      const originalStart =
         originalDate + ' ' + content[0].split(' to ')[0] + ':00';
      const originalEnd =
         originalDate + ' ' + content[0].split(' to ')[1] + ':00';
      const summary = this.googlePrefix + content[1];

      return {
         start: new Date(originalStart).toISOString(),
         end: new Date(originalEnd).toISOString(),
         summary,
         organizer: invitation ? 'an invitation' : content[2],
         status: invitation ? content[3] : 'confirmed',
         colorId: '2',
         description: '',
      };
   }
}
