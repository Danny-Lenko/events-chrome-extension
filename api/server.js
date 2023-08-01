import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";

import {
  getMockParticipants,
  getKeyParticipants,
} from "./controllers/glMeet.js";

import { postEvents } from "./controllers/postEvents.js";

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

app.post("/events", postEvents(db));

app.listen(port, () => {
  console.log(`extension api listening on port ${port}`);
});