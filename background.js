chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("google.com/calendar")) {

    // console.log(tab.url)
    // const queryParameters = tab.url.split("?")[1];
    // const urlParameters = new URLSearchParams(queryParameters);

    // chrome.tabs.sendMessage(tabId, {
    //   type: "NEW",
    //   videoId: urlParameters.get("v"),
    // });
  }
});
