import { authorize } from "../googleApiClient/glCalendarApiClient.js";
import { deleteGoogleEvent } from "./googleApi.js";

export const deleteEvent = (db) => async (req, res) => {
  const { summary, start, end } = req.body;
  const start_time = start;
  const end_time = end;

  try {
    const eventToDelete = await db("events")
      .where({ summary, start_time, end_time })
      .first();

    // const eventId = eventToDelete.id.replace(/-/g, "");

    // authorize()
    //   .then((auth) => deleteGoogleEvent(auth, eventId))
    //   .catch(console.error);

    await db("events").where({ summary, start_time, end_time }).del();
    const updatedEvents = await db("events").select("*");

    res.status(200).json({
      message: "Event deleted successfully",
      events: updatedEvents,
      deletedEvent: eventToDelete,
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
