export async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });

  return tabs[0];
}

//  ========================= a Content Script function that tracks initially added events

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
