import { getActiveTabURL } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  const container = document.getElementsByClassName("container")[0];
  const fastSuccessMsg =
    '<div class="title">Reading page content:</div><div class="result"> This page events are sent</div>';
  const slowSuccessMsg =
    '<div class="title">Reading page content:</div><div class="result">This page events are sent</div><div class="title">Yet another try to read:</div><div class="result">Page events are sent</div>';
  const failMsg = '<div class="title">Failed sending events</div>';

  if (
    activeTab.url.includes("google.com/calendar") ||
    activeTab.url.includes("outlook.live.com/calendar")
  ) {
    chrome.storage.sync.get("counter", (result) => {
      const counterValue = result.counter;
      console.log(counterValue);
      container.innerHTML =
        counterValue == 0 || counterValue == 1
          ? fastSuccessMsg
          : counterValue == 2
          ? slowSuccessMsg
          : failMsg;
    });
  } else {
    container.innerHTML =
      '<div class="title">This is not a calendar page.</div>';
  }
});
