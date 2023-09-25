export const deleteEvent = (db) => async (req, res) => {
   let eventToDelete;

   const { summary, start, end } = req.body;
   const start_time = start;
   const end_time = end;

   try {
      await db('events').where({ summary, start_time, end_time }).del();

      return res.status(200).json({
         message: 'Event deleted successfully',
         deletedEvent: eventToDelete,
      });
   } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
};
