let eventNodes = [];
let events = [];
let counter = 0;
let controller = 0;
let previousState = [];
let lastChange;

// ========================================== The Mutatation observer

const targetNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

const observer = new MutationObserver((mutationsList) => {
  const saveButton = document.getElementsByClassName("sh4OF")[0];
  const deleteButton = document.getElementsByClassName("jya0z")[0];

  if (saveButton) {
    saveButton.addEventListener("click", () => trackEventsChange());
  }
  if (deleteButton) {
    deleteButton.addEventListener("click", () => trackEventsChange());
  }

  for (const mutation of mutationsList) {
    if (
      mutation.addedNodes[0] &&
      [...mutation.addedNodes[0].classList].includes("Ki1Xx")
    ) {
      trackEventsChange();
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
        console.log('New Event:', extraObj)
      }

      if (wipedObj) {
        console.log('Removed:', wipedObj)
      }

      previousState = [...events];
    }
  }, 1000);
  controller = 0;
};

// =========================================== The Content Script

(() => {
  eventNodes = document.getElementsByClassName("Ki1Xx");
  chrome.storage.sync.set({ counter: null });

  if (eventNodes.length) {
    executeProvider(eventNodes);
    // wait for two seconds for async components to render
  } else {
    counter++;
    setTimeout(() => {
      eventNodes = document.getElementsByClassName("Ki1Xx");
      if (eventNodes.length) {
        executeProvider(eventNodes);
        // wait another two second if the first wait was too short
      } else {
        counter++;
        setTimeout(() => {
          eventNodes = document.getElementsByClassName("Ki1Xx");
          if (eventNodes.length) {
            executeProvider(eventNodes);
          }
        }, 2000);
      }
    }, 2000);
  }

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
