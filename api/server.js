import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";

import {
  getMockParticipants,
  getKeyParticipants,
} from "./controllers/glMeet.js";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    // port : 3306,
    user: "postgres",
    password: "dsaewq321",
    database: "events",
  },
});

db.select("*").from("ms_events").then(console.log);

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Uriy!");
});

app.get("/meet", getMockParticipants());
app.post("/meeting", getKeyParticipants());

app.post("/ms-events", async (req, res) => {
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
      .onConflict(["start_time", "end_time"])
      .merge();

    return res
      .status(201)
      .json({ message: "Events added or updated successfully" });
  } catch (error) {
    console.error("Error adding events:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

});

app.listen(port, () => {
  console.log(`extension api listening on port ${port}`);
});
