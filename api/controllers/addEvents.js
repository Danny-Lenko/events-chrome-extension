import { authorize } from '../googleApiClient/googleApiClient.js';
import { insertGoogleEvent } from './googleApi.js';

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
      await db('events')
         .insert(dbFormattedEvents)
         .onConflict(['summary', 'start_time', 'end_time'])
         .ignore();

      const updatedEvents = await db('events').select('*');

      const googleApiFormattedEvents = updatedEvents.map((event) => {
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
            id: id.replace(/-/g, ''),
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

      // comment out if you ain't testing the admin account
      for (const event of googleApiFormattedEvents) {
         authorize()
            .then((auth) => insertGoogleEvent(auth, event))
            .catch(console.error);
      }

      return res.status(201).json({
         message: 'Events added or updated successfully',
         events: updatedEvents,
      });
   } catch (error) {
      console.error('Error adding events:', error);
      return res.status(500).json({ error: 'Internal server error' });
   }
};
