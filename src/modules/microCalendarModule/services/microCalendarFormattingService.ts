import { MicroCalendarFormattingInterface } from '../types/microCalendarInterfaces';

export class MicroCalendarFormattingService
   implements MicroCalendarFormattingInterface
{
   private microsoftPrefix: string = 'ms: ';

   constructor() {}

   public editLikeGoogleApiWants(nodeContent: string) {
      if (!nodeContent) return;

      const regex =
         /from\s(.+?)\s(\d{2}:\d{2})\sto\s(\d{2}:\d{2})\s(.+?)\sorganizer\s(.+?)\sevent\sshown\sas\s(.+)/;

      const match = nodeContent.match(regex);

      if (match) return this.formatInvitation(match);
      return this.formatEvent(nodeContent);
   }

   private formatInvitation(match: RegExpMatchArray) {
      const originalDate = match[1];
      const startTime = match[2];
      const endTime = match[3];
      const description = match[4];
      const organizerMatch = match[5];
      const status = match[6];

      const start = new Date(`${originalDate} ${startTime}`).toISOString();
      const end = new Date(`${originalDate} ${endTime}`).toISOString();

      const organizer = organizerMatch ? organizerMatch.trim() : 'User';

      return {
         start,
         end,
         description: this.microsoftPrefix + description.trim(),
         organizer,
         status: status === 'Busy' ? 'confirmed' : 'tentative',
         colorId: '1',
      };
   }

   private formatEvent(nodeContent: string) {
      const regex =
         /event\sfrom\s(.+?)\s(\d{2}:\d{2})\sto\s(\d{2}:\d{2})\s(.+?)(?:\sToday's\sdate)?\sevent\sshown\sas\s(.+)/;

      const match = nodeContent.match(regex);

      const originalDate = match[1];
      const startTime = match[2];
      const endTime = match[3];
      const description = match[4];
      const status = match[5];

      const start = new Date(`${originalDate} ${startTime}`).toISOString();
      const end = new Date(`${originalDate} ${endTime}`).toISOString();

      return {
         start,
         end,
         description: this.microsoftPrefix + description.trim(),
         organizer: 'User',
         status: status === 'Busy' ? 'confirmed' : 'tentative',
         colorId: '1',
      };
   }
}
