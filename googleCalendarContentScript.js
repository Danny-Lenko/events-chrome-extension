let initialEvents = [];
let events = [];
let controller = 0;

let weekNode;
let weekNodeContent;

const initialTimeout = 3000;
const observerTimeout = initialTimeout + 1;

const googlePrefix = "gl: ";

// =========================================================== observer

const observerNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

const observer = new MutationObserver((mutationsList) => {
  trackEventsChange();

  const weekGotChanged = !trackWeekIntervalChange(weekNodeContent);
  if (weekGotChanged) {
    observer.disconnect(); // ================== fixes objectionalbe requests bug
    registerWeekChange();
    setTimeout(() => {
      observer.observe(observerNode, observerConfig);
    }, 3000); // =============================== fixes objectionable requests bug
  }
});

// ======================================================== content script

(() => {
  setTimeout(() => {
    getEvents();
    initialEvents = [...events];

    weekNode = document.querySelectorAll('[jsname="ixxhSe"]')[0];
    weekNodeContent = weekNode.getAttribute("data-start-date-key");
  }, initialTimeout);

  setTimeout(() => {
    observer.observe(observerNode, observerConfig);
  }, observerTimeout);
})();

// ========================================================== events getter function

const getEvents = () => {
  events = [];

  [...document.getElementsByClassName("ynRLnc")]
    .filter((node) => {
      const content = node.innerHTML.split(", ");
      return (
        content.length >= 5 &&
        !content[2].match(/^calendar:/i) &&
        !content[1].match(/^No title/i)
      );
    })
    .forEach((node) => {
      const content = editContent(node.innerHTML);
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
  const weekNode = document.querySelectorAll('[jsname="ixxhSe"]')[0];
  const newNodeContent =
    weekNode && weekNode.getAttribute("data-start-date-key");

  if (!prevState) return true;

  return prevState === newNodeContent;
};

const registerWeekChange = () => {
  if (controller < 1) {
    controller++;

    getEvents();
    initialEvents = [...events];

    weekNode = document.querySelectorAll('[jsname="ixxhSe"]')[0];
    weekNodeContent = weekNode && weekNode.getAttribute("data-start-date-key");
  }
  controller = 0;
};

// ============================================================= editor functions

const editContent = (str) => {
  const content = str.split(", ");

  const match = content[3].match(/needs rsvp/i);

  const invitation = match && match.length > 0;

  const originalDate =
    content[content.length - 2] + ", " + content[content.length - 1];

  const originalStart =
    originalDate + " " + content[0].split(" to ")[0] + ":00";
  const originalEnd = originalDate + " " + content[0].split(" to ")[1] + ":00";
  const description = googlePrefix + content[1];

  return {
    start: new Date(originalStart).toISOString(),
    end: new Date(originalEnd).toISOString(),
    description,
    organizer: invitation ? "an invitation" : content[2],
    status: invitation ? content[3] : "confirmed",
    colorId: "2",
  };
};
