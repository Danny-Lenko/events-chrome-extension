import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";
import dotenv from "dotenv";

import {
  getMockParticipants,
  getKeyParticipants,
} from "./controllers/glMeet.js";

import { authorize } from "./googleApiClient/googleApiClient.js";
import {
  listEvents,
  listLabels,
  createDraftEmail,
} from "./controllers/googleApi.js";
import { addEvents } from "./controllers/addEvents.js";
import { deleteEvent } from "./controllers/deleteEvent.js";

dotenv.config();

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    // port : 3306,
    user: "postgres",
    password: process.env.PG_PASSWORD,
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

app.delete("/delete-event", deleteEvent(db));

app.post("/error-ms-email", (req, res) => {
  try {
    // createDraftEmail();
    authorize().then(createDraftEmail).catch(console.error);
    return res.status(200).json("Message sent");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, async () => {
  console.log(`extension api listening on port ${port}`);

  try {
    // Call the function to fetch and log admin events
    authorize().then(listEvents).catch(console.error);
    authorize().then(listLabels).catch(console.error);
  } catch (error) {
    console.error("Error fetching admin events:", error);
  }
});
