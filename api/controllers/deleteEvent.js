export const deleteEvent = (db) => async (req, res) => {
  const { description, start, end } = req.body;
  const start_time = start;
  const end_time = end;

  try {
    await db("events").where({ description, start_time, end_time }).del();

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
