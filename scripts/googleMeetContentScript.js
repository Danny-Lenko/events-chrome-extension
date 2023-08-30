
// ---------------- variables --------------------
let rules;

let maxPartyQty;
let previousPartyQty;

let party = [];
let guests = [];

let leaveWithMyFriends = false;
let disabledParticipants = false;
let subtitlesOn = false;
let controller = 0;
let isMeeting = false;
let exitFullScreen = false;

let meetingsData = false;
let currentMeetingTitle;
let exitConfigList; // from server

const observerTargetNode = document.body;
const observerConfig = {
  childList: true,
  subtree: true,
};

const mockData = {
  participants: [
    {
      participantName: "Libertarian Personalist",
      participantRole: "lead",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Termin ScheduleApp",
      participantRole: "participant",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Кіріл",
      participantRole: "participant",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Samsung A32",
      participantRole: "participant",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
    {
      participantName: "Yuriy Motrych",
      participantRole: "participant",
      assignedTo: [
        'Daily meet up',
        'Refinement call',
      ],
    },
  ],
  googlemeetRules: {
    '12:00': {
      title: 'Refinement call',
      rules: {
        autoJoinParticipantsQuantity: 0,
        leaveTogetherWithMyGuys: {
          guys: ["Iex Cept", "Yuriy Motrych"],
          // leaveWhen may be "all" or "one" or "60%"
          leaveWhen: "all"
        },
        // may be false or true
        fullscreenOnJoin: false,
        percentageToLeave: 0,

        // may be false or true
        keepTabActive: false,
        // zoom may be "off" or "on" or "force"
        zoom: "off",
        // may be false or true
        showSubtitlesWhenZoomed: true,
      }
    },
    '14:15': {
      title: 'Daily meet up',
      rules: {
        // must be a number (+)
        autoJoinParticipantsQuantity: 1,
        leaveTogetherWithMyGuys: {
          // may be false or true (+)
          isTurnOn: true,
          guys: ["Libertarian Personalist", "Termin ScheduleApp"],
          // leaveWhen may be "all" or "one" or "some%" (+)
          leaveWhen: "one"
        },
        // may be false or true (+)
        fullscreenOnJoin: true,
        // may be in range from 0 to 1 (+)
        percentageToLeave: 0.73,

        // may be false or true
        keepTabActive: true,
        // zoom may be "off" or "on" or "force"
        zoom: "on",
        // may be false or true (+)
        showSubtitlesWhenZoomed: true,
      }
    },
  },
};

// -------------------- fetch meeting data -----------------------------

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8080/meet');
    if (!response.ok) {
      throw new Error('Request failed with status: ' + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// ------------- get meeting data and save to chrome.storage --------------

const getMeetingsData = async () => {
  chrome.storage.local.get(['meetingsData'], async (result) => {
    // here was a fetch query which has moved to observer callback
    exitConfigList = setMeetingConfigList();
    setMeetingsData();
  });
};

const setMeetingsData = () => {
  chrome.storage.local.set({ meetingsData }, () => {
    console.log('Meetings data saved to chrome.storage', meetingsData);
  });
};

// -------------------- meeting config -----------------------------

const setMeetingConfigList = () => {
  if (meetingsData.participants.length) {
    return meetingsData.participants
      .filter((item) => item.assignedTo.includes(currentMeetingTitle))
      .map((item) => {
        return {
          participantName: item.participantName,
          participantRole: item.participantRole,
        }
      });
  }
};

// ------------------ observer --------------------------

const observer = new MutationObserver(() => {
  const goMessage = [...document.getElementsByClassName("VfPpkd-gIZMF")];
  const redButton = document.querySelector('[jsname="CQylAd"]');
  const sharingNotice = document.getElementsByClassName("H0YpEc")[0];
  const participantsBtn = document.querySelectorAll('[jsname="A5il2e"]')[1]

  if (participantsBtn) {
    (async () => {
      await disableParticipants(participantsBtn)
    })()
  }

  // ---------------- fullscreen automatization ----------------
  const sharedScreenPeers = document.getElementsByClassName("P245vb");
  const sharedScreen =
    sharedScreenPeers && sharedScreenPeers.length > 1 && sharedScreenPeers[0];
  // ---------------- fullscreen automatization ----------------

  !meetingsData && (async () => {
    meetingsData = await fetchData() || mockData;
    previousPartyQty = Object.values(meetingsData.googlemeetRules).find(m => m.title === currentMeetingTitle)?.rules.autoJoinParticipantsQuantity
  })()

  currentMeetingTitle = getMeetTopic() // function for processing meeting name depends on local time
  console.log(currentMeetingTitle, ` - Is meeting: ${isMeeting}`)

  rules = meetingsData && Object.values(meetingsData.googlemeetRules).find(m => m.title === currentMeetingTitle).rules

   if (rules?.keepTabActive && isMeeting) {
     chrome.runtime.sendMessage({ action: 'keepTabActive' }); // there is a problem with moving to another tab when you are clicking and pressing mouse`s left button on tab which is not google meet, I added in background.js delay when the chrome event is checking moment of moving to another page, the event is called OnActivate
   }

  maxPartyQty = party.length;

  getParty()
  !isMeeting && registerMeeting()

  if (isMeeting) getMeetingsData() // get local storage data to exitConfigList

  const currentGuests = guestsHandler()

  if (!guests.length && currentGuests) {
    guests = guestsHandler();
  } else if (guests.length < currentGuests?.length) {
    guests = currentGuests
  }

  leaveWithMyFriends = leaveWithMyFriendsHandle();

  const checkExit = checkIfConfigRule();

  ((checkExit || party.length === 2) && maxPartyQty < previousPartyQty) && exitMeeting(redButton);

  previousPartyQty = maxPartyQty

  if (goMessage[0] || sharingNotice) {
    getParty();
    setTimeout(() => {
      if (checkIfAlone() || checkIfAloneAndScreenSharing()) {
        exitMeeting(redButton);
      }
    }, 3000);
  }

  // ---------------- fullscreen automization ----------------
  isFullScreenEnabled && window.addEventListener('keydown', (e) => {
    if (e.key === 'F11') exitFullScreen = true
  })

  if (goMessage) {
    isFullScreenEnabled = false;
    isScreenSharingActive = false;
  }

  if (sharingNotice) {
    checkScreenSharing(sharedScreen);
  }

  // ---------------- fullscreen automization ----------------
});

(() => {
  observer.observe(observerTargetNode, observerConfig);
})();

// ---------------- fullscreen automatization ----------------
let isFullScreenEnabled = false;
let isScreenSharingActive = false;

const enterFullScreenForParticipant = () => {
  if (!isFullScreenEnabled && rules.zoom !== 'off') {
    if (rules.zoom === 'forced') {
      chrome.runtime.sendMessage({ action: 'enterFullScreen' });
      isFullScreenEnabled = true;
    } else if (rules.zoom === 'on' && !exitFullScreen) {
      chrome.runtime.sendMessage({ action: 'enterFullScreen' });
      isFullScreenEnabled = true;
    }
  }
};

const checkScreenSharing = (sharedScreen) => {
  if (sharedScreen && !isScreenSharingActive) {
    isScreenSharingActive = true;
    enterFullScreenForParticipant();
    if (!subtitlesOn && rules.showSubtitlesWhenZoomed) {
      delay(onSubtitles, 4000)
      subtitlesOn = true
    }
  }
};
// ---------------- fullscreen automatization ----------------

// ------------------------- exit meeting -----------------------

const exitMeeting = (redButton) => {
  const role = myRole()

  if (role === 'lead' && party.length !== 2 && !leaveWithMyFriends) return
  if (party.length === 2 && conditionForTwoLeads()) return

  setTimeout(() => {
    if (controller < 1 && isMeeting) {
      controller++;
      redButton && redButton.click();
      setTimeout(() => {
        const terminalButton =
        document.getElementsByClassName("VfPpkd-LgbsSe")[2];

        controller = 0;
        isMeeting = false;
        terminalButton && terminalButton.click();
      }, 1000);
    }
  }, 1000);
}

// ------------------ participants list -------------------------

// If user is in the "spotlight" or "auto" display layout, then after creating the meeting,
// he/she clicks the "show everyone" button to open the "People" block with the meeting
// participants, which contains all the relevant information about the presence/absence of participants
// at the meeting, screen broadcasting, etc.
// During the full-screen mode, the "Participants" block can be turned off if necessary,
// but this may lead to incorrect operation of the extension, so it is advisable to turn this block back on
// when leaving the full-screen mode

const getParty = () => {
  let teammateNames = [];
  // more than 3s participation
  setTimeout(() => {
    teammateNames = [...document.getElementsByClassName("XEazBc")];
    const checkLayout = document.querySelector('[jsname="jrQDbd"]');
    if (checkLayout) {
      teammateNames = [...document.getElementsByClassName("jKwXVe")];
    }
    party = teammateNames && teammateNames.map(item => leadToGeneral(item.outerText));
  }, 3000);
};

// ----------------------------- register meeting -------------------------

const registerMeeting = () => {
  if (!meetingsData) return console.warn('Data is loading')
  const participantsInMeeting = document.querySelectorAll('[jsname="YLEF4c"]').length - 1 // minus 1 because of div includes your personal account`s photo
  const joinBtn = document.querySelector('[jsname="Qx7uuf"]')

  const autoFullScreen = rules.fullscreenOnJoin
  const autoJoin = rules.autoJoinParticipantsQuantity;

  if (participantsInMeeting >= autoJoin) {
    joinBtn.click()
    isMeeting = true

    if (autoFullScreen) {
      chrome.runtime.sendMessage({ action: 'enterFullScreenJoin' })
    }

    console.log('Meeting has started')
  }

  console.log("Meeting has not started")
};

// ------------------------- exit rules ---------------------------

function leaveWithMyFriendsHandle() {
  if(!meetingsData) return console.warn('Data is loading')
    if (!rules.leaveTogetherWithMyGuys.isTurnOn) return
    const friendsInMeetingCurrent = rules.leaveTogetherWithMyGuys.guys.filter((f) => !!party.find(p => p === f)).length
    const friendsInMeeting = rules.leaveTogetherWithMyGuys.guys.length
    const leaveWhen = rules.leaveTogetherWithMyGuys.leaveWhen
  return (
    leaveWhen === 'all'
      ? friendsInMeetingCurrent === 0
      : leaveWhen === 'one'
      ? friendsInMeetingCurrent === 1
      : friendsInMeetingCurrent <= friendsInMeeting * Number.parseInt(leaveWhen)/100
  )
}

async function disableParticipants(participantsBtn) {
  if (!disabledParticipants) {
    disabledParticipants = true

    await clickAndWait(participantsBtn, 4000)
    participantsBtn.disabled = disabledParticipants

    const closeBlock = document.querySelectorAll('.CYZUZd div')[1]
    const close = closeBlock.querySelector('span button');
    close.disabled = disabledParticipants
  }
}

const checkIfAlone = () => {
  return party.length === 1;
};

const checkIfAloneAndScreenSharing = () => {
  return party.length === 2 && party[0].includes(party[1]);
}

const checkIfConfigRule = () => {
  if (!exitConfigList) return console.warn('Data is not saved !')
  // notLeads has left more than 73%
  if (currentMeetingTitle === 'Daily meet up') return (dailyMeetUpRule() || leaveWithMyFriends)

  // not participants from the required list
  if (currentMeetingTitle === 'Refinement call') return (refinementCallRule() || leaveWithMyFriends)
}

const dailyMeetUpRule = () => {
  const { noLeads, leads } = leadsNoLeads()
  const guestQty = guests.length
  const maxRegisterNoLeads = noLeads.length + guestQty

  const currentNoLeads = party.filter((p) => !leads.includes(leadToGeneral(p))).length

  return currentNoLeads/maxRegisterNoLeads < 1 - rules.percentageToLeave; // Share of current not lead participants from register
}

const refinementCallRule = () =>
  !exitConfigList.filter(item => party.join(' ').includes(item.participantName)).length

const leadsNoLeads = () => {
  const leads = []
  const noLeads = []

  for (let i = 0; i < exitConfigList.length; i++) {
    exitConfigList[i].participantRole === 'lead'
      ? leads.push(exitConfigList[i].participantName)
      : noLeads.push(exitConfigList[i].participantName)
  }

  return {
    leads,
    noLeads
  }
}

const guestsHandler = () => {
  if (!exitConfigList) return
  const participants = exitConfigList.map((obj) => obj.participantName)
  return party.filter((p) => !participants.includes(leadToGeneral(p))).map((p) => leadToGeneral(p))
}

const leadToGeneral = (name) => name.replace(/(\n.*|\([^)]*\)|^\s+)/g, '')

function myRole() {
  if (!exitConfigList) return console.warn('Don\'t save in exitConfigList !')
  const participants = document.querySelectorAll('.dkjMxf')
  const me = participants[participants.length - 1]
  const myName = participants.length && me.querySelector('.XEazBc span div').outerText

  const isGuest = exitConfigList.filter((p) => p.participantName === myName)

  return isGuest.length === 0 ? 'participant' : isGuest[0].participantRole
}

const getMeetTopic = () => {
  if (!meetingsData) return console.warn('Data is loading')
  const startTimes = Object.keys(meetingsData.googlemeetRules)
  const localeCurrentDate = new Date();
  const nextDayTime = new Date()
    nextDayTime.setDate(nextDayTime.getDate() + 1)

  let currentMeetingTopic = 'Topic is absent'

  for (let i = 0; i < startTimes.length; i++) {
    const firstMeetTime = getLocaleTime(startTimes[0], false)
    const secondMeetTime = getLocaleTime(startTimes[1], false)

    const currentTime = getLocaleTime(startTimes[i], false)
    const nextTime = !startTimes[i + 1] ? null : getLocaleTime(startTimes[i + 1])

    if (localeCurrentDate >= nextTime) continue

    if ((localeCurrentDate >= currentTime && (localeCurrentDate < nextTime || !nextTime))) {
      const time = convertTimeWithZero(currentTime)
      currentMeetingTopic = meetingsData.googlemeetRules[time].title
    } else if (nextDayTime > currentTime && (localeCurrentDate > firstMeetTime && localeCurrentDate < secondMeetTime)) {
      const firstMeetKey = startTimes[0]
      currentMeetingTopic = meetingsData.googlemeetRules[firstMeetKey].title
    } else {
      const lastMeetKey = startTimes[startTimes.length - 1]
      currentMeetingTopic = meetingsData.googlemeetRules[lastMeetKey].title
    }
  }

  return currentMeetingTopic
}

function getLocaleTime(time, toLocaleString = true) {
  if (!time) return new Date().toLocaleString(undefined, {year: "numeric", month: "numeric", hour: 'numeric', minute: 'numeric'})
  const dateTimeFormat = new Intl.DateTimeFormat()
  const { timeZone } = dateTimeFormat.resolvedOptions()

  const [hours, minutes] = time.split(":")
  const currentDate = new Date()

  return ( toLocaleString ?
    new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes)
      .toLocaleString(undefined, {year: "numeric", month: "numeric", hour: 'numeric', minute: 'numeric', timeZone})
      : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes)
  )
}

const convertTimeWithZero = (time) => `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`

function conditionForTwoLeads () {
  if (!exitConfigList) return
  const { leads } = leadsNoLeads(exitConfigList)

  const qtyOfLeads = party
    .filter(p => leads.includes(p))
    .filter((p, i, arr) => p !== arr[i - 1])
    .length

  return qtyOfLeads === 2
}

async function onSubtitles() {
  const settingsMenu = document.querySelectorAll('[jsname="NakZHc"]')[1];
  await clickAndWait(settingsMenu, 0);

  const settingsWindow = document.querySelector('[jsname="dq27Te"]');
  await clickAndWait(settingsWindow, 2000);

  const subtitlesOptions = document.querySelectorAll('[jsname="IDf7eb"]');
  const subtitlesOption = subtitlesOptions[subtitlesOptions.length - 2].querySelector('span button')
  await clickAndWait(subtitlesOption, 500);

  const checkBox = document.querySelector('[jsname="BfMHN"]');
  await clickAndWait(checkBox, 0);

  const close = document.querySelector('.VfPpkd-Bz112c-LgbsSe.yHy1rc.eT1oJ.mN1ivc.VfPpkd-zMU9ub');
  await clickAndWait(close, 0);
}

async function clickAndWait(element, delay) {
  element.click();
  await new Promise(resolve => setTimeout(resolve, delay));
}

function delay(executeFn, delay) {
  return setTimeout(() => {
    executeFn()
  }, delay)
}
