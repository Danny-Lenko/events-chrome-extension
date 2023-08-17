import { google } from "googleapis";

// =============================================================== calendar

export async function listEvents(auth) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }
  console.log("Upcoming 10 events:");
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary} - ${event.id}`);
  });
}

export function insertGoogleEvent(auth, event) {
  const calendar = google.calendar({ version: "v3", auth });
  calendar.events.insert(
    {
      auth: auth,
      calendarId: "primary",
      resource: event,
    },
    function (err, event) {
      if (err) {
        console.log(
          "There was an error contacting the Calendar service: " + err
        );
        return;
      }
      console.log("Event created: %s", event.htmlLink);
    }
  );
}

export function deleteGoogleEvent(auth, eventId) {
  const calendar = google.calendar({ version: "v3", auth });

  calendar.events.delete(
    {
      calendarId: "primary",
      eventId: eventId,
    },
    function (err, response) {
      if (err) {
        console.error("Error deleting event:", err);
        return;
      }
      console.log("Event deleted:", eventId);
    }
  );
}

// ============================================================= gmail

export async function listLabels(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  const res = await gmail.users.labels.list({
    userId: "me",
  });
  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log("No labels found.");
    return;
  }
  console.log("Labels:");
  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}

export const createDraftEmail = async (auth) => {
  try {
    // Create Gmail API client
    const service = google.gmail({ version: "v1", auth });

    const utf8Subject = `=?utf-8?B?${Buffer.from("Extension Alert").toString(
      "base64"
    )}?=`;
    const emailLines = [
      `From: Extension <devdanny.14@gmail.com>`,
      `To: Admin <devdanny.14@gmail.com>`,
      `Content-type: text/html;charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      "",
      `hello world`,
    ];
    const email = emailLines.join("\r\n").trim();

    const encodedEmail = Buffer.from(email).toString("base64");
    const sentEmail = await service.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedEmail },
    });

    console.log("Email sent:", sentEmail.data);
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
};
