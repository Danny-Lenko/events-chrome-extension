let eventNodes = [];
let events = [];
let counter = 0;
let controller = 0;

const getEventNodes = () => {
  const mutationBtns = document.querySelectorAll('[role="button"]');
  return [...mutationBtns].filter(
    (el) => el.hasAttribute("data-eventchip") && el.childNodes.length === 3
  );
};

const observer = new MutationObserver((mutationsList) => {
  const saveButton = document.querySelector('[jsname="x8hlje"]')
  const deleteButton = document.querySelector('[jsname="VkLyEc"]')

  if (saveButton) {
    saveButton.addEventListener("click", () => trackEventsChange());
  }
  if (deleteButton) {
    deleteButton.addEventListener("click", () => trackEventsChange());
  }
});

const trackEventsChange = () => {
  setTimeout(() => {
    eventNodes = getEventNodes();
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
  eventNodes = getEventNodes();
  chrome.storage.sync.set({ counter: null });

  if (eventNodes.length) {
    executeProvider(eventNodes);
    // wait for two seconds for async components to render
  } else {
    counter++;
    setTimeout(() => {
      eventNodes = getEventNodes();
      if (eventNodes.length) {
        executeProvider(eventNodes);
        // wait another two second if the first wait was too short
      } else {
        counter++;
        setTimeout(() => {
          eventNodes = getEventNodes();
          if (eventNodes.length) {
            executeProvider();
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
    const info = element.children[0].textContent.split(", ");
    const time = info[0];
    const details = info[1];
    const date = info[4];

    events.push({
      time,
      details,
      date,
    });
  });

  console.log(events);
  console.log(counter);
  chrome.storage.sync.set({ counter });
};
