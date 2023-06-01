let eventNodes = [];
let events = [];
let counter = 0;
let controller = 0;

let previousState = [];
let lastChange;

let weekIntervalNode;
let weekIntervalContent;

// ========================================== The Mutatation observer

const targetNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (
      mutation.addedNodes[0] &&
      [...mutation.addedNodes[0].classList].includes("Ki1Xx")
    ) {
      trackEventsChange();
    }

    const weekGotChanged = !trackWeekIntervalChange(weekIntervalContent);
    if (weekGotChanged) {
      registerWeekChange();
      console.log("week got changed");
      readWeeklyInfo()
    }
  }
});

// =================================== Funtion tracks events changes and executes the comparison one

const trackEventsChange = () => {
  setTimeout(() => {
    eventNodes = document.getElementsByClassName("Ki1Xx");
    if (controller < 1) {
      controller++;

      executeProvider(eventNodes);

      const extraObj = findExtraObject(previousState, events);
      const wipedObj = findExtraObject(events, previousState);

      if (extraObj) {
        console.log("New Event:", extraObj);
      }

      if (wipedObj) {
        console.log("Removed:", wipedObj);
      }

      previousState = [...events];
    }
  }, 1000);
  controller = 0;
};

// ================================ Functions track if week changes and registeres the change

const trackWeekIntervalChange = (prevState) => {
  // const newIntervalNode = document.getElementsByClassName("YjxmP");
  const newIntervalContent =
    weekIntervalNode.length && weekIntervalNode[0].textContent;

  if (!prevState) return true;

  return prevState === newIntervalContent;
};

const registerWeekChange = () => {
  if (controller < 1) {
    controller++;

    weekIntervalNode = document.getElementsByClassName("YjxmP");
    weekIntervalContent =
      weekIntervalNode.length && weekIntervalNode[0].textContent;
  }
  controller = 0;
};

// ===================================================================================================

const readWeeklyInfo = () => {
  getObservedNodes()

  if (eventNodes.length) {
    executeProvider(eventNodes);
    previousState = [...events];
  } else {
    counter++;
    // wait for two seconds for async components to render
    setTimeout(() => {
      getObservedNodes()

      if (eventNodes.length) {
        executeProvider(eventNodes);
        previousState = [...events];
      } else {
        counter++;
        // wait another two second if the first wait was too short
        setTimeout(() => {
          const eventsGrid = document.getElementsByClassName("JWaNH");
          getObservedNodes()

          if (eventNodes.length) {
            executeProvider(eventNodes);
            previousState = [...events];
          }
          if (!eventNodes.length && eventsGrid.length) {
            events = [];
            previousState = [];
          }
        }, 2000);
      }
    }, 2000);
  }
};

const getObservedNodes = () => {
  eventNodes = document.getElementsByClassName("Ki1Xx");
  weekIntervalNode = document.getElementsByClassName("YjxmP");
  weekIntervalContent =
    weekIntervalNode.length && weekIntervalNode[0].textContent;
}

// =========================================== The Content Script

(() => {
  chrome.storage.sync.set({ counter: null });
  readWeeklyInfo();
  observer.observe(targetNode, observerConfig);
})();

// ======================================== Funtions set the global events variable up

const executeProvider = (eventElements) => {
  events = [];

  [...eventElements].forEach((element) => {
    const info = element.children[0].ariaLabel;
    const { time, date, details } = editContent(info);

    events.push({
      time,
      date,
      details,
    });
  });

  chrome.storage.sync.set({ counter });
};

const editContent = (initialContent) => {
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

// ====================================== Function compares the prev state events array and the new state one

function findExtraObject(arrayOne, arrayTwo) {
  const lengthOne = arrayOne.length;
  const lengthTwo = arrayTwo.length;

  console.log(arrayOne)
  console.log(arrayTwo)

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
