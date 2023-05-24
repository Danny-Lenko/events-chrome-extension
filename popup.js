import { getActiveTabURL } from "./utils.js";

const container = document.getElementsByClassName("container")[0];

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();

  if (
    activeTab.url.includes("google.com/calendar") ||
    activeTab.url.includes("outlook.live.com/calendar")
  ) {
    return;
  } else {
    container.innerHTML =
      '<div class="title">This is not a calendar page.</div>';
  }
});

function updatePopupContent(events) {
  // const eventsContainer = document.getElementById("ti");
  const container = document.getElementsByClassName("container")[0];
  container.innerHTML = '<div class="title">finally got them</div>';
  ; // Clear previous content

  events.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.textContent = `Time: ${event.time}, Date: ${event.date}, Details: ${event.details}`;
    container.appendChild(eventElement);
  });
}

chrome.runtime.onMessage.addListener((message) => {
  const { events } = message;
  updatePopupContent(events);
});


// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   console.log('here goes the message:', message)
//   // container.innerHTML = message
//   // sendResponse({
//   //     data: "I am fine, thank you. How is life in the background?"
//   // }); 
// });