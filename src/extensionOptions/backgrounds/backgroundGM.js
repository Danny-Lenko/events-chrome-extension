let keepTabActiveMode = false;
let activeTabId = null;
let tabSwitchTimer = null;

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'enterFullScreen') {

    let found = false;
    let tabId = undefined;
    let currentTabId = undefined;

    chrome.tabs.query(
      { active: true, windowType: "normal", currentWindow: true },
      (tab) => {
        currentTabId = tab[0].id;

        const currentUrl = tab[0].url;
        if (currentUrl.includes("meet.google.com")) {
          const activeWindowId = tab[0].windowId;
          chrome.tabs.update(currentTabId, { active: true }, () => {
            chrome.windows.update(activeWindowId, { state: 'fullscreen' });
          });
        }

        chrome.tabs.query({}, (tabs) => {
          for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].audible) {
              found = true;
              tabId = tabs[i].id;
              winId = tabs[i].windowId;
            }
          }

          if (found == true && tabId != currentTabId) {
            chrome.tabs.update(tabId, { active: true }, () => {
              chrome.windows.update(winId, { state: 'fullscreen' });
            });
          }
        });
      }
    );
  }
  if (message.action === 'enterFullScreenJoin') {
    let currentTabId = undefined;

    chrome.tabs.query(
      {active: true, windowType: "normal", currentWindow: true},
      (tab) => {
        currentTabId = tab[0].id;

        const currentUrl = tab[0].url;
        if (currentUrl.includes("meet.google.com")) {
          const activeWindowId = tab[0].windowId;
          chrome.tabs.update(currentTabId, {active: true}, () => {
            chrome.windows.update(activeWindowId, {state: 'fullscreen'});
          });
        }
      }
    )
  }
  if (message.action === 'keepTabActive') {
    keepTabActiveMode = true;
    setActiveTab();
  }
  if (message.action === 'disableFullScreen') {
    chrome.tabs.query(
      { active: true, windowType: "normal", currentWindow: true },
      (tab) => {
        let currentTabId = currentTabId = tab[0].id;

        const currentUrl = tab[0].url;
        if (currentUrl.includes("meet.google.com")) {
          const activeWindowId = tab[0].windowId;
          chrome.tabs.update(currentTabId, {active: true}, () => {
            chrome.windows.update(activeWindowId, {state: 'normal'});
          });
        }
      })

  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (keepTabActiveMode && tab.url.includes("meet.google.com")) {
    activeTabId = tabId;
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  if (keepTabActiveMode && activeTabId && activeTabId !== activeInfo.tabId) {
    if (tabSwitchTimer) {
      clearTimeout(tabSwitchTimer);
    }

    tabSwitchTimer = setTimeout(() => {
      chrome.tabs.update(activeTabId, { active: true });
    }, 300);
  }
});

function setActiveTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const activeTab = tabs[0];
      if (activeTab.url.includes("meet.google.com")) {
        activeTabId = activeTab.id;
      }
    }
  });
}
