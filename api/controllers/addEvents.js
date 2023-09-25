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

      return res.status(201).json({
         message: 'Events added or updated successfully',
      });
   } catch (error) {
      console.error('Error adding events to db:', error);
   }
};
