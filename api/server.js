import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 8080;

const currentMeeting = {
  participants: [
    {
      participantName: "Yuriy Motrych",
      participantRole: "organizer",
    },
    {
      participantName: "Kateryna Pakharenko",
      participantRole: "participant",
    },
    {
      participantName: "Valerii Danylenko",
      participantRole: "participant",
    },
  ],
};

app.use(bodyParser.json());
// app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Uriy!");
});

app.get("/meet", (req, res) => {
  return res.json(currentMeeting);
});

app.listen(port, () => {
  console.log(`extension api listening on port ${port}`);
});

const meetingsData = {
  participants: [
    {
      participantId: 1,
      participantName: "Yuriy Motrych",
      participantRole: "organizer",
    },
    {
      participantId: 2,
      participantName: "Kateryna Pakharenko",
      participantRole: "participant",
    },
    {
      participantId: 3,
      participantName: "Valerii Danylenko",
      participantRole: "participant",
    },
    {
      participantId: 4,
      participantName: "Danylo Tabachenko",
      participantRole: "participant",
    },
    {
      participantId: 5,
      participantName: "Enver Emir-Useynov",
      participantRole: "participant",
    },
    {
      participantId: 6,
      participantName: "Oleksandr Sulzhenko",
      participantRole: "organizer",
    },
  ],
  topics: [
    {
      topicId: 1,
      topicTitle: "Daily Standup",
    },
    {
      topicId: 2,
      topicTitle: "Release discussion",
    },
    {
      topicId: 3,
      topicTitle: "Scrum poker",
    },
  ],
};
