#!/bin/bash

# create min folder
mkdir -p dist/min

uglifyjs googleMeetContentScript.js -o dist/min/googleMeet.min.js
uglifyjs googleCalendarContentScript.js -o dist/min/googleCalendar.min.js
uglifyjs microMailContentScript.js -o dist/min/microMail.min.js
uglifyjs microCalendarContentScript.js -o dist/min/microCalendar.min.js
