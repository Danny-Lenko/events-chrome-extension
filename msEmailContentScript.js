const mockFilterString = "football";
const cryptoSecretKey = "evening-eats-events-crypto";

let filterRegex;
let controller = 0;

// =========================================================== observer

const observerNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

const observer = new MutationObserver((mutationsList) => {
  const mails = document.getElementsByClassName("hcptT");
  const loadingOverlay = document.getElementById("loading-overlay");

  if (!mails[0] && controller < 1) {
    handleNoMails(mails);
  }

  if (checkIsEmpty(mails)) {
    loadingOverlay?.remove();
  }

  filterMails(mails);
});

// ======================================================== observer utility functions

function handleNoMails(mails) {
  let { loadingOverlay, countDownMessage, initialCountdown, loadingMessage } =
    generateFallback();

  loadingOverlay.appendChild(countDownMessage);

  const waitMailsInterval = setInterval(() => {
    initialCountdown--;
    countDownMessage.textContent = initialCountdown;
    loadingOverlay.appendChild(countDownMessage);

    if (checkIsEmpty(mails)) {
      clearInterval(waitMailsInterval);
    }

    if (initialCountdown < 0) {
      clearInterval(waitMailsInterval);

      // the send message logic
      sendMessage();
      countDownMessage.remove();
      loadingMessage.innerText =
        "Failed filtering mails. Admin has been informed";
    }
  }, 1000);

  document.body.appendChild(loadingOverlay);

  controller++;
}

function checkIsEmpty(mails) {
  const emptyEl = document.getElementById("EmptyState_MainMessage");
  const secondaryEl = document.getElementsByClassName("TrKke")[0];

  return (
    mails[0] ||
    (emptyEl && emptyEl.innerText !== "Select an item to read") ||
    (secondaryEl && secondaryEl.innerHTML !== "Nothing is selected")
  );
}

const sendMessage = async () => {
  try {
    const res = await fetch("http://localhost:8080/error-ms-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
      body: "",
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

function filterMails(mails) {
  [...mails].forEach((node) => {
    const content = node.getAttribute("aria-label");

    if (content && !content.match(filterRegex)) {
      node.parentElement.parentElement.style.display = "block";
    }

    if (content && content.match(filterRegex)) {
      node.parentElement.parentElement.style.display = "none";
    }
  });
}

// ======================================================== content script

(async () => {
  try {
    const { filterString } =
      (await fetchSeverRules()) || (await getStorageRules());
    filterRegex = new RegExp(filterString, "ig");
  } catch (error) {
    console.error("Error getting storage data:", error);
    filterRegex = new RegExp(mockFilterString, "ig");
  }

  observer.observe(observerNode, observerConfig);
})();

// ======================================================= content script utilities

async function fetchSeverRules() {
  try {
    const response = await fetch("http://localhost:8080/rules");
    if (!response.ok) {
      throw new Error("Request failed with status: " + response.status);
    }
    const data = await response.json();
    setStorageRules(data);

    const { adminEmail, emailServices } = JSON.parse(data);
    const { filterString } = emailServices;

    return { filterString, adminEmail };
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function setStorageRules(data) {
  // const cryptoData = encryptData(data, cryptoSecretKey);


  // chrome.storage.local.set({ extensionRules: cryptoData }, () => {
  //   console.log("Extension rules saved to chrome.storage", data);
  // });
}

function getStorageRules() {
  console.log("storage reached");

  return new Promise((resolve, reject) => {
    chrome.storage.local.get((cryptoData) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      if (!cryptoData.extensionRules) {
        reject("No extension settings in storage yet");
        return;
      }

      console.log(cryptoData);

      // const data = decryptData(cryptoData, cryptoSecretKey);

      // console.log(data);

      const { adminEmail, emailServices } = JSON.parse(data.extensionRules);
      const { filterString } = emailServices;
      resolve({ adminEmail, filterString });
    });
  });
}

// ======================================================= fallback screen settings

function generateFallback() {
  let initialCountdown = 3;

  const loadingOverlay = document.createElement("div");
  loadingOverlay.id = "loading-overlay";
  loadingOverlay.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  const loadingSpinner = document.createElement("div");
  loadingSpinner.style = `
    border: 4px solid #3498db;
    border-top: 4px solid transparent;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }
  `;

  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(
    `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
    styleSheet.cssRules.length
  );

  const loadingMessage = document.createElement("div");
  loadingMessage.textContent = `Check If Inbox is Empty...`;
  loadingMessage.style = `
    margin-top: 20px;
  `;

  const countDownMessage = document.createElement("div");
  countDownMessage.textContent = initialCountdown;

  loadingOverlay.appendChild(loadingSpinner);
  loadingOverlay.appendChild(loadingMessage);

  return { loadingOverlay, countDownMessage, initialCountdown, loadingMessage };
}

// ========================================== web crypto api

// function encryptData(data) {
//   window.crypto.subtle
//     .generateKey(
//       {
//         name: "AES-GCM",
//         length: 256, // 256 bits
//       },
//       true, // Extractable
//       ["encrypt", "decrypt"] // Key usages
//     )
//     .then((key) => {
//       const jsonString = JSON.stringify(data);
//       const iv = window.crypto.getRandomValues(new Uint8Array(12));
//       const encoder = new TextEncoder();
//       const encodedData = encoder.encode(jsonString);

//       return window.crypto.subtle.encrypt(
//         {
//           name: "AES-GCM",
//           iv: iv,
//         },
//         key,
//         encodedData
//       );
//     });
// }
