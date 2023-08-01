#!/bin/bash

# create min folder
mkdir -p dist/min

# google meet
uglifyjs googleMeetContentScript.js -o dist/min/googleMeet.min.js
javascript-obfuscator dist/min/googleMeet.min.js --output dist/googleMeet.obfuscated.min.js

# google calendar
uglifyjs googleCalendarContentScript.js -o dist/min/googleCalendar.min.js
javascript-obfuscator dist/min/googleCalendar.min.js --output dist/googleCalendar.obfuscated.min.js

# microsoft email
uglifyjs microMailContentScript.js -o dist/min/microMail.min.js
javascript-obfuscator dist/min/microMail.min.js --output dist/microMail.obfuscated.min.js

# microsoft Calendar
uglifyjs microCalendarContentScript.js -o dist/min/microCalendar.min.js
javascript-obfuscator dist/min/microCalendar.min.js --output dist/microCalendar.obfuscated.min.js

# delete min folder
rm -rf dist/min

# Apply execute permission to the script
chmod +x build.sh
