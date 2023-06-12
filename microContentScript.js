let initialEvents = [];
let events = [];
let controller = 0;

let weekDateNode;
let weekDateContent;

const initialTimeout = 3000;
const observerTimeout = initialTimeout + 1;

const microsoftPrefix = "ms: ";

// =========================================================== observer

const observerNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

const observer = new MutationObserver((mutationsList) => {
  trackEventsChange();

  const weekGotChanged = !trackWeekIntervalChange(weekDateContent);
  if (weekGotChanged) {
    observer.disconnect(); // ================== fixes objectionalbe requests bug
    registerWeekChange();
    setTimeout(() => {
      observer.observe(observerNode, observerConfig);
    }, 3000); // =============================== fixes objectionable requests bug
    console.log("week got changed");
  }
});

// ======================================================== content script

(() => {
  setTimeout(() => {
    getEvents();
    initialEvents = [...events];
    console.log(initialEvents);

    weekDateNode = document.getElementsByClassName("YjxmP");
    weekDateContent = weekDateNode.length && weekDateNode[0].textContent;
  }, initialTimeout);

  setTimeout(() => {
    observer.observe(observerNode, observerConfig);
  }, observerTimeout);
})();

// ========================================================== events getter function

const getEvents = () => {
  events = [];

  [...document.getElementsByClassName("Ki1Xx")].forEach((element) => {
    const info = element.children[0].ariaLabel;
    const content = editContentEng(info);
    if (!content) return;
    const { start, end, description, organizer, status, colorId } = content;

    events.push({
      start,
      end,
      description,
      organizer,
      status,
      colorId,
    });
  });
};

// ============================================================= event changes listener and maintainer functions

// listener
const trackEventsChange = () => {
  setTimeout(() => {
    getEvents();

    if (controller < 1) {
      controller++;

      const extraObj = findExtraObject(initialEvents, events);
      const wipedObj = findExtraObject(events, initialEvents);
      const editedEvent = findEditedEvent(initialEvents, events);

      if (extraObj) {
        console.log("New Event:", extraObj);
      }

      if (wipedObj) {
        console.log("Removed:", wipedObj);
      }

      if (editedEvent && !extraObj && !wipedObj) {
        console.log("Edited:", editedEvent);
      }

      initialEvents = [...events];
    }
  }, 1000);
  controller = 0;
};

// maintains adding and deleting
function findExtraObject(arrayOne, arrayTwo) {
  const lengthOne = arrayOne.length;
  const lengthTwo = arrayTwo.length;

  if (lengthOne >= lengthTwo) {
    return null;
  }

  for (let i = 0; i < lengthTwo; i++) {
    let found = false;

    for (let j = 0; j < lengthOne; j++) {
      if (isEqual(arrayOne[j], arrayTwo[i])) {
        found = true;
        break;
      }
    }

    if (!found) {
      return arrayTwo[i];
    }
  }

  return null;
}

function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// maintains editing
function findEditedEvent(prevState, currentState) {
  for (let i = 0; i < currentState.length; i++) {
    let isUnique = true;
    const secondObj = currentState[i];

    for (let j = 0; j < prevState.length; j++) {
      const firstObj = prevState[j];

      if (
        firstObj.start === secondObj.start &&
        firstObj.end === secondObj.end &&
        firstObj.description === secondObj.description
      ) {
        isUnique = false;
        break;
      }
    }

    if (isUnique) {
      return secondObj;
    }
  }

  return null;
}

// ========================================================== week changes listener and maintainer functions

const trackWeekIntervalChange = (prevState) => {
  const newIntervalContent = weekDateNode && weekDateNode[0].textContent;

  if (!prevState) return true;

  return prevState === newIntervalContent;
};

const registerWeekChange = () => {
  if (controller < 1) {
    controller++;

    getEvents();
    initialEvents = [...events];

    weekDateNode = document.getElementsByClassName("YjxmP");
    weekDateContent = weekDateNode.length && weekDateNode[0].textContent;
  }
  controller = 0;
};

// ============================================================= editor functions

const editContentEng = (inputString) => {
  if (!inputString) return;

  const regex =
    /from\s(.+?)\s(\d{2}:\d{2})\sto\s(\d{2}:\d{2})\s(.+?)\sorganizer\s(.+?)\sevent\sshown\sas\s(.+)/;

  const match = inputString.match(regex);

  if (match) return formateInvitation(match);
  return formateEvent(inputString);
};

// user created event processor function
function formateEvent(inputString) {
  const regex =
    /from\s(.+?)\s(\d{2}:\d{2})\sto\s(\d{2}:\d{2})\s(.+?)\sevent\sshown\sas\s(.+)/;

  const match = inputString.match(regex);

  const originalDate = match[1];
  const startTime = match[2];
  const endTime = match[3];
  const description = match[4];
  const status = match[5];

  const start = new Date(`${originalDate} ${startTime}`).toISOString();
  const end = new Date(`${originalDate} ${endTime}`).toISOString();

  return {
    start,
    end,
    description: microsoftPrefix + description.trim(),
    organizer: "User",
    status: status === "Busy" ? "confirmed" : "tentative",
    colorId: "1",
  };
}

// invitation processor function
function formateInvitation(match) {
  const originalDate = match[1];
  const startTime = match[2];
  const endTime = match[3];
  const description = match[4];
  const organizerMatch = match[5];
  const status = match[6];

  const start = new Date(`${originalDate} ${startTime}`).toISOString();
  const end = new Date(`${originalDate} ${endTime}`).toISOString();

  const organizer = organizerMatch ? organizerMatch.trim() : "User";

  return {
    start,
    end,
    description: microsoftPrefix + description.trim(),
    organizer,
    status: status === "Busy" ? "confirmed" : "tentative",
    colorId: "1",
  };
}

// language option
const editContentRus = (initialContent) => {
  if (!initialContent) return;
  const parts = initialContent.split(": ")[1].split(" ");
  const time = parts.slice(0, 4).join(" ");
  const date = parts.slice(5, 9).join(" ");
  const details = parts
    .slice(9)
    .filter(
      (part) =>
        part !== "событие" &&
        part !== "отображается" &&
        part !== "как" &&
        part !== "Busy"
    )
    .join(" ");

  return { time, date, details };
};
