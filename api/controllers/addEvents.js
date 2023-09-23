import { authorize } from '../googleApiClient/googleApiClient.js';
import { clearAggregatorEvents, insertNewGoogleEvent } from './googleApi.js';

export const addEvents = (db) => async (req, res) => {
   const incomingEvents = req.body;

   const dbFormattedEvents = incomingEvents.map((event) => {
      const { summary, description, organizer, status, start, end, colorId } =
         event;

      return {
         summary,
         description,
         organizer,
         status,
         start_time: start,
         end_time: end,
         color_id: colorId,
      };
   });

   try {
      const auth = await authorize();
      clearAggregatorEvents(auth);

      await db('events')
         .insert(dbFormattedEvents)
         .onConflict(['summary', 'start_time', 'end_time'])
         .ignore();

      const updatedEvents = await db('events').select('*');
      const googleApiFormattedEvents = formatDbEvents(updatedEvents);

      for (const event of googleApiFormattedEvents) {
         authorize()
            .then((auth) => insertNewGoogleEvent(auth, event))
            .catch(console.error);
      }

      return res.status(201).json({
         message: 'Events added or updated successfully',
         events: updatedEvents,
      });
   } catch (error) {
      console.error('Error adding events to db:', error);
   }

};

export function formatDbEvents(events) {
   return events.map((event) => {
      const {
         id,
         summary,
         start_time,
         end_time,
         color_id,
         organizer,
         description,
      } = event;

      return {
         summary,
         start: {
            dateTime: start_time,
            timeZome: 'Europe/Kyiv',
         },
         end: {
            dateTime: end_time,
            timeZome: 'Europe/Kyiv',
         },
         colorId: color_id,
         organizer,
         description,
      };
   });
}
