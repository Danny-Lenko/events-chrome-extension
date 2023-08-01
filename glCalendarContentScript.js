let events = [];

const googlePrefix = "gl: ";

const observerNode = document.body;
const observerConfig = {
  childList: true,
  subtree: true,
};
const observer = new MutationObserver((mutationsList) => {
  getEvents();
  postEvents(events);
});

(() => {
  console.log("hello world");
  observer.observe(observerNode, observerConfig);
})();

function getEvents() {
  events = [];

  [...document.getElementsByClassName("ynRLnc")]
    .filter((node) => {
      const content = node.innerHTML.split(", ");
      return (
        content.length >= 5 &&
        !content[2].match(/^calendar:/i) &&
        !content[1].match(/^No title/i)
      );
    })
    .forEach((node) => {
      const content = editContent(node.innerHTML);
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
  if (!events[0]) return;
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

const editContent = (str) => {
  const content = str.split(", ");

  const match = content[3].match(/needs rsvp/i);

  const invitation = match && match.length > 0;

  const originalDate =
    content[content.length - 2] + ", " + content[content.length - 1];

  const originalStart =
    originalDate + " " + content[0].split(" to ")[0] + ":00";
  const originalEnd = originalDate + " " + content[0].split(" to ")[1] + ":00";
  const description = googlePrefix + content[1];

  return {
    start: new Date(originalStart).toISOString(),
    end: new Date(originalEnd).toISOString(),
    description,
    organizer: invitation ? "an invitation" : content[2],
    status: invitation ? content[3] : "confirmed",
    colorId: "2",
  };
};
