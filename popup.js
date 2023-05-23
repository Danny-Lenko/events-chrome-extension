import { getActiveTabURL } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();

  if (
    activeTab.url.includes("google.com/calendar") ||
    activeTab.url.includes("outlook.live.com/calendar")
  ) {
    return;
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML =
      '<div class="title">This is not a calendar page.</div>';
  }
});
