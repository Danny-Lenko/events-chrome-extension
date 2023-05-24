let eventElements = [];
let events = [];
let counter = 1;

(() => {
  eventElements = document.getElementsByClassName("Ki1Xx");

  if (eventElements.length) {
    executeProvider();
    // wait for two seconds for async components to render
  } else {
    counter++;
    setTimeout(() => {
      eventElements = document.getElementsByClassName("Ki1Xx");
      if (eventElements.length) {
        executeProvider();
        // wait another two second if the first wait was too short
      } else {
        counter++;
        setTimeout(() => {
          eventElements = document.getElementsByClassName("Ki1Xx");
          if (eventElements.length) {
            executeProvider();
          }
        }, 2000);
      }
    }, 2000);
  }
})();

const executeProvider = () => {
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

  chrome.runtime.sendMessage({ events });
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
