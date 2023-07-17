let party = [];
let controller = 0;
let isMeeting = false;

const meetingTimeout = 10000;
const observerTargetNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

const observer = new MutationObserver((mutationsList) => {
  const goMessage = document.getElementsByClassName("VfPpkd-gIZMF")[0];
  const redButton = document.querySelector('[jsname="CQylAd"]');

  const sharedScreenPeers = document.getElementsByClassName("P245vb");
  const sharedScreen =
    sharedScreenPeers && sharedScreenPeers.length > 1 && sharedScreenPeers[0];

  const sharingNotice = document.getElementsByClassName("H0YpEc")[0];

  // console.log(sharingNotice);

  getParty();
  registerMeeting();
  console.log(checkIfLead(meetingsData));

  if (goMessage) {
    getParty();
    if (checkIfAlone()) {
      setTimeout(() => {
        if (controller < 1 && isMeeting) {
          controller++;
          redButton.click();
          setTimeout(() => {
            const terminalButton =
              document.getElementsByClassName("VfPpkd-LgbsSe")[2];

            controller = 0;
            isMeeting = false;
            terminalButton.click();
          }, 1000);
        }
      }, 1000);
    }
  }
});

(() => {
  observer.observe(observerTargetNode, observerConfig);
})();

const getParty = () => {
  party = [...document.getElementsByClassName("dkjMxf")];
  const organizer = document.querySelector('[jsname="JS8eVc"]');
  if (organizer) {
    party.push("organizer");
  } else {
    party.filter((player) => player !== "organizer");
  }
};

const checkIfLead = (data) => {
  const participants = data.participants;
  const userNames = [...document.getElementsByClassName("XEazBc")].map(
    (el) => el.innerHTML
  );
  const userName = userNames.pop();

  const user = participants.find((user) => user.participantName === userName);

  return user && user.participantRole === "lead";
};

const checkIfAlone = () => {
  return party.length === 1;
};

const registerMeeting = () => {
  const isEnaughParty = party.length > 1;
  if (isEnaughParty) {
    setTimeout(() => {
      isMeeting = true;
      console.log("the meeting has begun");
    }, meetingTimeout);
  }
};

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
    {
      participantId: 7,
      participantName: "Валерій Володимирович Даниленко",
      participantRole: "participant",
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
