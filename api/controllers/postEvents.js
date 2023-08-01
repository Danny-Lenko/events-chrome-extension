export const postEvents = (db) => async (req, res) => {
  const incomingEvents = req.body;

  const formattedEvents = incomingEvents.map((event) => {
    const { description, organizer, status, start, end, colorId } = event;
    return {
      description,
      organizer,
      status,
      start_time: start,
      end_time: end,
      color_id: colorId,
    };
  });

  try {
    await db("ms_events")
      .insert(formattedEvents)
      .onConflict(["description"])
      .merge();

    return res
      .status(201)
      .json({ message: "Events added or updated successfully" });
  } catch (error) {
    console.error("Error adding events:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
