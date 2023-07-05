# Chrome Extension

## Table of contents

- [To Readme Content Editor](#to-readme-content-editor)
- [Download and Build Guide](#download-and-build-guide)
  - [Prerequisites](#prerequisites)
  - [Downloading the Source Code](#downloading-the-source-code)
  - [Building the Extension](#building-the-extension)
- [Browser Installation](#browser-installation)
- [Further Development and Maintenance](#further-development-and-maintenance)
  - [New Features](#new-features)
    - [New Files](#new-files)
  - [Maintenance Guide](#maintenance-guide)
    - [Continued Testing](#continued-testing)
    - [Antifragility](#antifragility)
    - [Documentation](#documentation)
- [Miscellaneous Docs and Help for Newbies](#miscellaneous-docs-and-help-for-newbies)
  - [Usage Guide](#usage-guide)
    - [Google Meet Features](#google-meet-features)
    - [Google Calendar Features](#google-calendar-features)
    - [MS Calendar Features](#ms-calendar-features)
    - [MS Email Features](#ms-email-features)
  - [Structure]
    - [Google Meet Elements](#google-meet-elements)
    - [Google Calendar Elements](#google-calendar-elements)
    - [MS Calendar Elements](#ms-calendar-elements)
    - [MS Email Elements](#ms-email-elements)
  - [Troubleshooting](#troubleshooting)
  - [FAQs](#faqs)
- [Prioritizing](#prioritizing)
  - [Critical Alarms](#critical-alarms)
  - [Console Alarms](#console-alarms)


## **To Readme Content Editor**

1. **Please don't use the autoformat save on this file!**


## Download and Build Guide

This guide provides step-by-step instructions for downloading and building the Chrome extension. \
It covers important aspects such as minification and obfuscation to ensure an optimized and secure final build.

### Prerequisites

Before proceeding with the download and build process, make sure you have the following prerequisites installed and updated on your system:

    - Node.js
    - npm
    - Git

### Downloading the Source Code

GitLab does not provide a direct way to download a specific folder as a separate archive file. \
Instead, you download the entire repository as a ZIP archive and then extract the specific folder from it.

Or clone the repo to your local machine and execute: \
`cd src/main/chrome-extension`

### Building the Extension

To build the Chrome extension with minification and obfuscation, follow these steps:

  1. In the Windows settings choose the 'Git for Windows' app as the default program to open .sh files
  
  2. Install the project dependencies by running the following command: \
  `npm install`
  
  3. Open the manifest.json file in the root directory and make any necessary modifications to fit your extension's requirements (e.g., update permissions, background scripts, content scripts, etc.).

  4. In the PowerShell terminal run the build command to generate the optimized build: \
  `npm run build`

  5. The build process will perform tasks such as minification and obfuscation to optimize the code. Once the build process completes successfully, the generated files will be placed in the dist/ directory.

  6. The dist/ directory will contain the optimized build of your Chrome extension. You can now load this build in your Chrome browser for testing or publish it to the Chrome Web Store.

## Browser Installation

To test the extension locally in your Chrome browser, follow these steps:

  1. Open the Chrome browser and navigate to chrome://extensions.

  2. Enable the "Developer mode" toggle switch in the top-right corner of the page.

  3. Click on the "Load unpacked" button.

  4. In the file dialog, navigate to the dist/ directory of your extension's build and select it.

  5. The extension will be loaded into Chrome, and you can now test its functionality on your desired webpages.

  <sup>if you want to test without running the build, do the same but for the root folder<sup>

## Further Development and Maintenance

This guide provides instructions for developers on ongoing development and maintenance

### New Features

A browser extension new features development should be done with respect to its structural hallmarks and needs. \
Here are some guidelines to help with development: 

#### New files

  1. To get your new file features work, make sure to register it in the manifest.json appropriately
  
  2. To get your new .js file be in the build version of the app, make sure to add it to the build.sh
  <sup>Note: at the moment the build script supports only the .js files transformation<sup>

### Maintenance Guide

Maintaining a Chrome extension involves ensuring its continued functionality and compatibility with changes in external dependencies. \
Here are some guidelines to help with maintenance:

#### Continued testing

Regularly test the extension against new updates or changes in the target services (such as Microsoft) to identify any compatibility issues. This ensures that the extension remains functional and provides a good user experience.

#### Antifragility

Design your features to be resilient and adaptable to changes. To ensure quick reaction to an external shake, consider the following steps:

  1. Check on a feature significance to prioritize the error handling technique complexity applied.
  2. If a feature is of the highest priority make sure to set up the ADMIN_ROLE automatic notification for it.
  3. Always keep guides on the important features' fix well detailed and updated.
  4. Continually add version checks and fallback mechanisms to handle different attribute values variations.
  5. According to the checks, provide fellow developers with the clear grasp about what part of the target interface needs their attention. 

If for example an HTML attribute used in any of the target services changes, consider the following steps:

  1. Analyze the impact of the change on your extension.
  2. Update your extension's code to accommodate the new HTML attribute or structure.
  3. Test your extension thoroughly to ensure it functions correctly with the updated attribute.

#### Documentation

Maintain up-to-date README.md including installation instructions, troubleshooting tips, and frequently asked questions (FAQs).

## Miscellaneous Docs and Help for Newbies

Documentation and resources to help new developers get started with the extension:

### Usage Guide

Answers on how to use the extension, includes configuration options, features and settings available

#### Google meet features

1. Extension considers the meeting active if 10 seconds have passed since user #2 joined

2. Extension ends up the meeting if there is only one user left in the active meeting

3. The configuration of the end of the meeting depending on the name of the meeting and the people whose exit affects the end. Example:
      a) "360/platform - Daily Standup", exit when Victoria and Kateryna leave
      b) "Release discussion" to react when Enver leaves

4. Supports some regime, Ura is due to describe it

#### Google calendar features

1. Full support for only English language, weekly interface, date format yyyy-mm-dd, 1:01-23:59

2. Collects all events on the page

3. Formats the data according to the Google Calendar API format

4. __Not yet__ sends the formatted events data to the server. Emulated with the console message

4. Listens to the appearance of new events both added by users and invitations

5. Listens to the removal of existing events made by a user

6. __Not yet__ listens to the cancellation of an invitation

7. Listens to the editing of an event both by a user and for an invitation

8. __Not yet__ sends the changes described in the 4-7 cases to the server. Emulated with the console message

9. The formatter related to the #3 case adds the 'gl:' prefix to the description property. Seen in the console

10. The formatter adds the {colorId: '2'} property. Seen in the console

#### MS calendar features

1. Number 1-8 cases from the [Google](#google-calendar) work the same as on the Google Calendar page

2. The formatter related adds the 'ms:' prefix to the description property. Seen in the console

3. The formatter adds the {colorId: '1'} property. Seen in the console

#### MS Email features

1. Filters the Outlook email letters

2. Letters with a certain string in the subject or description are not displayed

3. Filtering with full matching, i.e. if the string is "hello world", then letters that contain "hello" are displayed

### Structure

#### Google meet elements
  1. 'User leaves meeting' event is tracked by: \
  `const goMessage = document.getElementsByClassName("VfPpkd-gIZMF")[0];`

  2. 'Terminate meeting' event is achieved by click on: \
  `const redButton = document.querySelector('[jsname="CQylAd"]')`

  3. 'Confirm meeting termination' event is achieved by click on: \
  `const terminalButton = document.getElementsByClassName("VfPpkd-LgbsSe")[2]`

  4. 'All users' collection is gathered by tracking the: \
  `party = [...document.getElementsByClassName("dkjMxf")];`

  5. 'The two users corner case' is solved by check on the:
  `const organizer = document.querySelector('[jsname="JS8eVc"]');`


#### Google calendar elements
(...rest)
#### MS calendar elements
(...rest)
#### MS email elements
(...rest)

### Troubleshooting

Lists common issues that developers might encounter and provides steps to resolve them.

The 'npm run build' command does not work \
  **Solution:**
  1) Install Git Bash globally; \
  2) Open Git Bash terminal in the root folder; \
  3) Execute the 'npm run build-bash' \


### FAQs 

Q: What are the 'target services'?
A: The web pages, applications we are operating with via the extension. At the moment, this list includes: Google Meet, Google Calendar, MS Email, MS Calendar

## Prioritizing

Features' stability prioritizing

### Critical Alarms

1. Not possible to filter email (alongside implement the eternal loading fallback. trigger the native one)

2. Not possible to terminate a Google meeting

### Console Alarms

1. Not possible to fullsreen the shared window during a Google meeting