import { google } from 'googleapis';

export async function insertNewGoogleEvent(auth, event) {
   const calendar = google.calendar({ version: 'v3', auth });

   const existingEvent = await findExistingEvent(calendar, event);

   if (!existingEvent) {
      calendar.events.insert(
         {
            auth: auth,
            calendarId: 'primary',
            resource: event,
         },
         function (err, event) {
            if (err) {
               console.log(
                  'There was an error contacting the Calendar service: ' + err,
               );
               return;
            }
            // console.log('Event created: %s', event);
         },
      );
   } else {
      console.log('Event already exists: %s', existingEvent);
   }
}

async function findExistingEvent(calendar, newEvent) {
   const res = await calendar.events.list({
      calendarId: 'primary',
   });

   const events = res.data.items;

   for (const event of events) {
      if (
         event.start.dateTime === newEvent.start.dateTime &&
         event.end.dateTime === newEvent.end.dateTime &&
         event.summary === newEvent.summary
      ) {
         return event;
      }
   }

   return null;
}

export function clearAggregatorEvents(auth) {
   const calendar = google.calendar({ version: 'v3', auth });

   calendar.calendars.clear(
      {
         calendarId: 'primary',
      },
      (err, res) => {
         // console.log(res);
         if (err) return err;
      },
   );
}

export async function listEvents(auth) {
   const calendar = google.calendar({ version: 'v3', auth });
   const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
   });
   const events = res.data.items;
   if (!events || events.length === 0) {
      console.log('No upcoming events found.');
      return;
   }
   console.log('Upcoming 10 events:');
   events.map((event, i) => {
      const start = event.start.dateTime || event.start.date;
      console.log(`${start} - ${event.summary} - ${event.id}`);
   });
}

export async function deleteGoogleEvent(auth, eventId) {
   const calendar = google.calendar({ version: 'v3', auth });

   calendar.events.delete(
      {
         calendarId: 'primary',
         eventId: eventId,
      },
      function (err, response) {
         if (err) {
            console.error('Error deleting event:', err);
            return;
         }
         console.log('Event deleted:', eventId);
      },
   );
}

// ============================================ gmail

export const createDraftEmail = async (auth, configData) => {
   const { adminEmail, extensionEmail } = JSON.parse(configData);
   console.log(adminEmail);
   try {
      // Create Gmail API client
      const service = google.gmail({ version: 'v1', auth });

      const utf8Subject = `=?utf-8?B?${Buffer.from('Extension Alert').toString(
         'base64',
      )}?=`;
      const emailLines = [
         `From: Extension <${extensionEmail}>`,
         `To: Admin <${adminEmail}>`,
         `Content-type: text/html;charset=utf-8`,
         `MIME-Version: 1.0`,
         `Subject: ${utf8Subject}`,
         '',
         `hello world`,
      ];
      const email = emailLines.join('\r\n').trim();

      const encodedEmail = Buffer.from(email).toString('base64');
      const sentEmail = await service.users.messages.send({
         userId: 'me',
         requestBody: { raw: encodedEmail },
      });

      console.log('Email sent:', sentEmail.data);
   } catch (error) {
      console.error(`An error occurred: ${error}`);
   }
};
