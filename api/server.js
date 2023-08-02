import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";

import {
  getMockParticipants,
  getKeyParticipants,
} from "./controllers/glMeet.js";

import { addEvents } from "./controllers/addEvents.js";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    // port : 3306,
    user: "postgres",
    password: "dsaewq321",
    database: "extension",
  },
});

db.select("*").from("events").then(console.log);

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Uriy!");
});

app.get("/meet", getMockParticipants());
app.post("/meeting", getKeyParticipants());

app.post("/add-events", addEvents(db));

app.delete("/delete-events", async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`extension api listening on port ${port}`);
});
