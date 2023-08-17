const filterString = "football";
const reg = new RegExp(filterString, "ig");

let controller = 0;

// =========================================================== observer

const observerNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

const observer = new MutationObserver((mutationsList) => {
  const mails = document.getElementsByClassName("hcptT");
  const noEmails = checkIsEmpty();

  const loadingOverlay = document.getElementById("loading-overlay");

  if (!mails[0] && controller < 1) {
    let { loadingOverlay, countDownMessage, initialCountdown, loadingMessage } =
      generateFallback();
    loadingOverlay.appendChild(countDownMessage);

    const interval = setInterval(() => {
      initialCountdown--;
      countDownMessage.textContent = initialCountdown;
      loadingOverlay.appendChild(countDownMessage);

      if (initialCountdown < 0) {
        clearInterval(interval);

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

  if (noEmails) {
    loadingOverlay?.remove();
  }

  [...mails].forEach((node) => {
    const content = node.getAttribute("aria-label");

    if (content && !content.match(reg)) {
      node.parentElement.parentElement.style.display = "block";
    }

    if (content && content.match(reg)) {
      node.parentElement.parentElement.style.display = "none";
    }
  });
});

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

// ======================================================== content script

(() => {
  observer.observe(observerNode, observerConfig);
})();

function checkIsEmpty() {
  const emptyEl = document.getElementById("EmptyState_MainMessage");

  return emptyEl?.innerText === "All done for the day";
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
    // background-color: #f0f0f0;
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
