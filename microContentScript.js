let initialEvents = [];
let events = [];
let controller = 0;

let weekDateNode;
let weekDateContent;

const initialTimeout = 3000;
const observerTimeout = initialTimeout + 1;

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
    observer.disconnect();                // fixes objectionalbe requests bug
    registerWeekChange();
    setTimeout(() => {
      observer.observe(observerNode, observerConfig);
    }, 3000)                              // fixes objectionable requests bug
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
    const content = editContent(info);
    if (!content) return;
    const { time, date, details } = content;

    events.push({
      time,
      date,
      details,
    });
  });
};

// ============================================================= event changes listener and maintainer functions

const trackEventsChange = () => {
  setTimeout(() => {
    getEvents();

    if (controller < 1) {
      controller++;

      const extraObj = findExtraObject(initialEvents, events);
      const wipedObj = findExtraObject(events, initialEvents);

      if (extraObj) {
        console.log("New Event:", extraObj);
      }

      if (wipedObj) {
        console.log("Removed:", wipedObj);
      }

      initialEvents = [...events];
    }
  }, 1000);
  controller = 0;
};

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

const editContent = (initialContent) => {
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
