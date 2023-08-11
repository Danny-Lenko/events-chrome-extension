let events = [];
let targetEvent = {};

const microsoftPrefix = "ms: ";

const observerNode = document.body;
const observerConfig = {
  childList: true,
  subtree: true,
};
const observer = new MutationObserver((mutationsList) => {
  getEvents();
  getTargetEvent();
  deleteTargetEvent(targetEvent);
  postEvents(events);
});

(() => {
  console.log("hello world");
  observer.observe(observerNode, observerConfig);
})();

function getTargetEvent() {
  const descriptionNode = document.querySelector(".rHI1u");
  const timeNode = document.querySelector(".AhH9N");

  if (descriptionNode && timeNode) {
    const regexPattern =
      /^(\w{3}) (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) - (\d{2}:\d{2})$/;

    const match = timeNode.textContent.match(regexPattern);

    if (match) {
      const day = match[1];
      const startDate = match[2];
      const endTime = match[3];

      const inputStart = `${day} ${startDate}`;
      const inputEnd = `${day} ${startDate.substring(0, 11)} ${endTime}`;

      const start = new Date(inputStart).toISOString();
      const end = new Date(inputEnd).toISOString();

      targetEvent = {
        description: `${microsoftPrefix}${descriptionNode.textContent}`,
        start,
        end,
      };
    }
  }
}

const deleteTargetEvent = async (event) => {
  if (!event.description || !event.start || !event.end) return;

  const tooltip = document.querySelector(".Os1Gu");

  if (tooltip && tooltip.textContent === "Event deleted") {
    const reqBody = JSON.stringify(event);

    try {
      const res = await fetch("http://localhost:8080/delete-event", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/JSON",
        },
        body: reqBody,
      });
      if (!res.ok) {
        throw new Error("Request failed with status: " + res.status);
      }
      const resData = await res.json();
      console.log(resData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    targetEvent = {};
  }
};

function getEvents() {
  events = [];

  [...document.getElementsByClassName("Ki1Xx")].forEach((element) => {
    const info =
      element.children[0] && element.children[1]
        ? element.children[0].ariaLabel || element.children[1].ariaLabel
        : null;

    if (!info) return;

    const content = editContentEng(info);

    if (!content) return;
    const { start, end, description, organizer, status, colorId } = content;

    events.push({
      start,
      end,
      description,
      organizer,
      status,
      colorId,
    });
  });
}

const postEvents = async (events) => {
  if (!events.length) return;

  const reqBody = JSON.stringify(events);
  try {
    const res = await fetch("http://localhost:8080/add-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
      body: reqBody,
    });
    if (!res.ok) {
      throw new Error("Request failed with status: " + res.status);
    }
    const resData = await res.json();
    console.log(resData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// ============================================================= editor functions

const editContentEng = (inputString) => {
  if (!inputString) return;

  const regex =
    /from\s(.+?)\s(\d{2}:\d{2})\sto\s(\d{2}:\d{2})\s(.+?)\sorganizer\s(.+?)\sevent\sshown\sas\s(.+)/;

  const match = inputString.match(regex);

  if (match) return formatInvitation(match);
  return formatEvent(inputString);
};

// user created event processor function
function formatEvent(inputString) {
  const regex =
    /event\sfrom\s(.+?)\s(\d{2}:\d{2})\sto\s(\d{2}:\d{2})\s(.+?)(?:\sToday's\sdate)?\sevent\sshown\sas\s(.+)/;

  const match = inputString.match(regex);

  const originalDate = match[1];
  const startTime = match[2];
  const endTime = match[3];
  const description = match[4];
  const status = match[5];

  const start = new Date(`${originalDate} ${startTime}`).toISOString();
  const end = new Date(`${originalDate} ${endTime}`).toISOString();

  return {
    start,
    end,
    description: microsoftPrefix + description.trim(),
    organizer: "User",
    status: status === "Busy" ? "confirmed" : "tentative",
    colorId: "1",
  };
}

// invitation processor function
function formatInvitation(match) {
  const originalDate = match[1];
  const startTime = match[2];
  const endTime = match[3];
  const description = match[4];
  const organizerMatch = match[5];
  const status = match[6];

  const start = new Date(`${originalDate} ${startTime}`).toISOString();
  const end = new Date(`${originalDate} ${endTime}`).toISOString();

  const organizer = organizerMatch ? organizerMatch.trim() : "User";

  return {
    start,
    end,
    description: microsoftPrefix + description.trim(),
    organizer,
    status: status === "Busy" ? "confirmed" : "tentative",
    colorId: "1",
  };
}
