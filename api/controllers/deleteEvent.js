import { authorize } from '../googleApiClient/googleApiClient.js';
import {
   clearAggregatorEvents,
   insertNewGoogleEvent,
   listEventsToConsole,
} from './googleApi.js';
import { formatDbEvents } from './addEvents.js';

export const deleteEvent = (db) => async (req, res) => {
   const { summary, start, end } = req.body;
   const start_time = start;
   const end_time = end;

   let eventToDelete;
   let eventId;

   try {
      eventToDelete = await db('events')
         .where({ summary, start_time, end_time })
         .first();
      eventId = eventToDelete.id.replace(/-/g, '');

      const auth = await authorize();
      clearAggregatorEvents(auth);

      await db('events').where({ summary, start_time, end_time }).del();
      const updatedEvents = await db('events').select('*');

      const googleApiFormattedEvents = formatDbEvents(updatedEvents);


      for (const event of googleApiFormattedEvents) {
         authorize()
            .then((auth) => insertNewGoogleEvent(auth, event))
            .catch(console.error);
      }

      await listEventsToConsole(auth);

      return res.status(200).json({
         message: 'Event deleted successfully',
         events: updatedEvents,
         deletedEvent: eventToDelete,
      });
   } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
};
