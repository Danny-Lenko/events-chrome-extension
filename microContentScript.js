let eventNodes = [];
let events = [];
let counter = 0;
let controller = 0;

const observer = new MutationObserver((mutationsList) => {
  const saveButton = document.getElementsByClassName("sh4OF")[0];
  const deleteButton = document.getElementsByClassName("jya0z")[0];

  if (saveButton) {
    saveButton.addEventListener("click", () => trackEventsChange());
  }
  if (deleteButton) {
    deleteButton.addEventListener("click", () => trackEventsChange());
  }
});

const trackEventsChange = () => {
  setTimeout(() => {
    eventNodes = document.getElementsByClassName("Ki1Xx");
    if (controller < 1) {
      controller++;
      executeProvider(eventNodes);
    }
  }, 1000);
  controller = 0;
};

const targetNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

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

  console.log(events);
  console.log(counter);
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
