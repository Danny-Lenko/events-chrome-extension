// ---------------- variables --------------------

let party = [];
let teammateNames = [];
let controller = 0;
let isMeeting = false;

let meetingsData;
let currentMeetingTitle;
let exitConfig;
const percentageToLeave = 0.73;

let meetings = [
  {
    title: "Daily meet up",
    registerMeetingRule: {
      meetingTime: new Date(2023, 6, 17, 17, 0, 0),
      meetingNum: 1,
    },
  },
  {
    title: "Refinement call",
    registerMeetingRule: {
      meetingTime: new Date(2023, 6, 17, 17, 0, 0),
      meetingNum: 0,
    },
  },
];

const meetingTimeout = 10000;
const observerTargetNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

// -------------------- fetch meeting data -----------------------------

const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:8080/meet");
    if (!response.ok) {
      throw new Error("Request failed with status: " + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// ------------- get meeting data and save to chrome.storage --------------

const getMeetingsData = async (title) => {
  chrome.storage.local.get(["meetingsData"], async (result) => {
    meetingsData = await fetchData();
    // meetingsData = result.meetingsData || (await fetchData());
    exitConfig = setMeetingConfig(title);
    setMeetingsData(meetingsData);
  });
};

const setMeetingsData = (data) => {
  chrome.storage.local.set({ meetingsData: data }, () => {
    console.log("Meetings data saved to chrome.storage");
  });
};
currentMeetingTitle = meetings[0].title;
getMeetingsData(currentMeetingTitle);

// -------------------- meeting config -----------------------------

const setMeetingConfig = (meetTitle) => {
  if (meetingsData.participants.length) {
    const partys = meetingsData.participants
      .filter((item) => item.assignedTo.includes(meetTitle))
      .map((item) => {
        return {
          participantName: item.participantName,
          participantRole: item.participantRole,
        };
      });
    return partys;
  }
};

// ------------------ observer --------------------------

const observer = new MutationObserver((mutationsList) => {
  const goMessage = [...document.getElementsByClassName("VfPpkd-gIZMF")];
  const redButton = document.querySelector('[jsname="CQylAd"]');
  const sharingNotice = document.getElementsByClassName("H0YpEc")[0];

  getParty();
  !isMeeting && registerMeeting();

  const checkExit = checkIfConfigRule(exitConfig);
  const isLead = checkIfLead(meetingsData)
  checkExit && !isLead && exitMeeting(redButton);

  // console.log(checkExit)

  if (goMessage[0] || sharingNotice) {
    getParty();
    setTimeout(() => {
      if (checkIfAlone() || checkIfAloneAndScreenSharing()) {
        exitMeeting(redButton);
      }
    }, 3000);
  }
});

(() => {
  observer.observe(observerTargetNode, observerConfig);
})();

// ------------------------- exit meeting -----------------------

const exitMeeting = (redButton) => {
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
};

// ------------------ participants list -------------------------

// If user is in the "spotlight" or "auto" display layout, then after creating the meeting,
// he/she clicks the "show everyone" button to open the "People" block with the meeting
// participants, which contains all the relevant information about the presence/absence of participants
// at the meeting, screen broadcasting, etc.
// During the full-screen mode, the "Participants" block can be turned off if necessary,
// but this may lead to incorrect operation of the extension, so it is advisable to turn this block back on
// when leaving the full-screen mode

const getParty = () => {
  // more than 3s participation
  setTimeout(() => {
    teammateNames = [...document.getElementsByClassName("XEazBc")];
    const checkLayout = document.querySelector('[jsname="jrQDbd"]');
    if (checkLayout) {
      teammateNames = [...document.getElementsByClassName("jKwXVe")];
    }
    party = teammateNames.map((item) => item.outerText);
  }, 3000);
};

// ----------------------------- register meeting -------------------------

const registerMeeting = () => {
  meetings.map((meet) => {
    time = meet.registerMeetingRule.meetingTime;
    num = meet.registerMeetingRule.meetingNum;

    if (time && num) {
      const isEnaughParty = party.length >= num;
      const isMeetingTime = new Date() >= time;

      if (isEnaughParty && isMeetingTime) {
        setTimeout(() => {
          isMeeting = true;
          console.log("the meeting has begun");
        }, meetingTimeout);
      }
    } else {
      const isMeetingTime = new Date() >= time;
      const isMeetingParticipants = party.length >= 1;

      if (isMeetingTime && isMeetingParticipants) {
        setTimeout(() => {
          isMeeting = true;
          console.log("the meeting has begun");
        }, meetingTimeout);
      }
    }
  });
};

// ------------------------- exit rules ---------------------------

const checkIfAlone = () => {
  return party.length === 1;
};

const checkIfAloneAndScreenSharing = () => {
  return party.length === 2 && party[0].includes(party[1]);
};

const checkIfConfigRule = (exitConfig) => {
  if (!exitConfig) {
    return false;
  }
  // noLead to leave more than 73%
  if (currentMeetingTitle === "Daily meet up") {
    let prevNum = 0;
    let currentNum, maxNum;

    const noLeads = exitConfig
      .filter((item) => item.participantRole !== "lead")
      .map((item) => item.participantName);
    currentNum = noLeads.filter((item) =>
      party.join(" ").includes(item)
    ).length;
    if (currentNum >= prevNum) {
      prevNum = currentNum;
      maxNum = currentNum;
    } else {
      return currentNum / maxNum < 1 - percentageToLeave;
    }
  }

  // no participants from the required list
  if (currentMeetingTitle === "Refinement call") {
    return !exitConfig.filter((item) => party.join(" ").includes(item)).length;
  }
};

const checkIfLead = (data) => {
  const participants = data.participants;
  const userNames = [...document.getElementsByClassName("XEazBc")].map(
    (el) => el.innerHTML
  );
  const userName = userNames.pop();

  const user = participants.find((user) => user.participantName === userName);

  console.log(user, user && user.participantRole === "lead");

  return user && user.participantRole === "lead";
};
