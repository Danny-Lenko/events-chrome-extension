import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 8080;

const currentMeeting = {
  participants: [
    {
      participantName: "Yuriy Motrych",
      participantRole: "lead",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Kateryna Pakharenko",
      participantRole: "participant",
      assignedTo: [
        'Daily meet up',
      ],
    },
    {
      participantName: "Valerii Danylenko",
      participantRole: "lead",      
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Danylo Tabachenko",
      participantRole: "participant",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Enver Emir-Useynov",
      participantRole: "participant",
      assignedTo: [
        //'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Валерій Володимирович Даниленко",
      participantRole: "lead",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
  ],
  meetTopics: [
    {
      title: 'Daily meet up',
      rules: {
        percentageToLeave: true,
        requiredPartys: false,
      }
    },
    {
      title: 'Refinement call',
      rules: {
        percentageToLeave: false,
        requiredPartys: true,
      }
    }
  ],
};

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello Uriy!");
});

app.get("/meet", (req, res) => {
  return res.json(currentMeeting);
});

app.listen(port, () => {
  console.log(`extension api listening on port ${port}`);
});
