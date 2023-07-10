export const getMockParticipants = () => (req, res) => {
  return res.json(mockedParticipants);
};

export const getKeyParticipants = () => (req, res) => {
  const { meeting } = req.body;
  const participants = meetingsData.topics.find(
    (topic) => topic.topicTitle === meeting
  ).keyParticipants;
  const response = meetingsData.participants.filter((member) =>
    participants.includes(member.participantName)
  );
  res.json(response);
};

const mockedParticipants = {
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

const currentMeetingName = "Daily Standup";

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
      keyParticipants: [
        "Kateryna Pakharenko",
        "Danylo Tabachenko",
        "Enver Emir-Useynov",
      ],
    },
    {
      topicId: 2,
      topicTitle: "Release discussion",
      keyParticipants: [
        "Danylo Tabachenko",
        "Oleksandr Sulzhenko",
        "Enver Emir-Useynov",
      ],
    },
    {
      topicId: 3,
      topicTitle: "Scrum poker",
      keyParticipants: [
        "Kateryna Pakharenko",
        "Valerii Danylenko",
        "Yuriy Motrych",
      ],
    },
  ],
};
