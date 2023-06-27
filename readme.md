# Chrome Extension

## Table of contents

- [Download and Build Guide](#download-and-build-guide)
  - [Prerequisites](#prerequisites)
  - [Downloading the Source Code](#downloading-the-source-code)
  - [Building the Extension](#building-the-extension)
- [Browser Installation](#browser-installation)
- [Further Development and Maintenance](#further-development-and-maintenance)

  - [What I learned](#what-i-learned)
    - [APIs Projects](#apis-projects)
    - [DOM Projects](#dom-projects)
    - [Roll Dice Game](#roll-dice-game)
    - [JS Projects (@andy)](#js-projects)
    - [Battleships Game](#battleships-game)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)

## Download and Build Guide

This guide provides step-by-step instructions for downloading and building the Chrome extension. \
It covers important aspects such as minification and obfuscation to ensure an optimized and secure final build.

### Prerequisites

Before proceeding with the download and build process, make sure you have the following prerequisites installed and updated on your system:

    - Node.js
    - npm
    - Git Bash

### Downloading the Source Code

GitLab does not provide a direct way to download a specific folder as a separate archive file. \
Instead, you download the entire repository as a ZIP archive and then extract the specific folder from it.

Or clone the repo to your local machine and execute: \
`cd src/main/chrome-extension`

### Building the Extension

To build the Chrome extension with minification and obfuscation, follow these steps:

  1. Install the project dependencies by running the following command:
  `npm install`
  
  2. Open the manifest.json file in the root directory and make any necessary modifications to fit your extension's requirements \
  (e.g., update permissions, background scripts, content scripts, etc.).

  3. Run the build command to generate the optimized build:
  `npm run build`

  4. The build process will perform tasks such as minification and obfuscation to optimize the code. Once the build process completes successfully, the generated files will be placed in the dist/ directory.

  5. The dist/ directory will contain the optimized build of your Chrome extension. You can now load this build in your Chrome browser for testing or publish it to the Chrome Web Store.