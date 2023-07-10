import express from "express";
import bodyParser from "body-parser";

import {
  getMockParticipants,
  getKeyParticipants,
} from "./controllers/glMeet.js";

const app = express();
const port = 8080;

app.use(bodyParser.json());
// app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Uriy!");
});

app.get("/meet", getMockParticipants());
app.post("/meeting", getKeyParticipants());

app.listen(port, () => {
  console.log(`extension api listening on port ${port}`);
});
