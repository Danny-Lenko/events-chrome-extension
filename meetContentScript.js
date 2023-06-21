let party = [];
let controller = 0;
let isMeeting = false;

const meetingTimeout = 10000;
const observerTargetNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

const observer = new MutationObserver((mutationsList) => {
  const goMessage = document.getElementsByClassName("VfPpkd-gIZMF")[0];
  const redButton = document.querySelector('[jsname="CQylAd"]');

  getParty();
  registerMeeting();

  if (goMessage) {
    getParty();
    if (checkIfAlone()) {
      setTimeout(() => {
        if (controller < 1 && isMeeting) {
          controller++;
          redButton.click();
          setTimeout(() => {
            const terminalButton =
              document.getElementsByClassName("VfPpkd-LgbsSe")[2];

            controller = 0;
            isMeeting = false;
            terminalButton.click();
          }, 1000);
        }
      }, 1000);
    }
  }
});

(() => {
  observer.observe(observerTargetNode, observerConfig);
})();

const getParty = () => {
  party = [...document.getElementsByClassName("dkjMxf")];
  const organizer = document.querySelector('[jsname="JS8eVc"]');
  if (organizer) {
    party.push("organizer");
  } else {
    party.filter((player) => player !== "organizer");
  }
};

const checkIfAlone = () => {
  return party.length === 1;
};

const registerMeeting = () => {
  const isEnaughParty = party.length > 1;
  if (isEnaughParty) {
    setTimeout(() => {
      isMeeting = true;
      console.log("the meeting has begun");
    }, meetingTimeout);
  }
};

// =================================================================== more optimized listener

//   for (const mutation of mutationsList) {
//  if (
//    mutation.addedNodes.length &&
//    mutation.addedNodes[0].classList &&
//    [...mutation.addedNodes[0].classList].length &&
//    [...mutation.addedNodes[0].classList].includes("dkjMxf")
//  ) {
//    getParty();
//    console.log(party);
//  }
//  if (
//    mutation.removedNodes.length &&
//    mutation.removedNodes[0].classList &&
//    [...mutation.removedNodes[0].classList].length &&
//    [...mutation.removedNodes[0].classList].includes("dkjMxf")
//  ) {
//    getParty();
//    console.log(party);
//  }

//  if (
//    mutation.removedNodes.length &&
//    mutation.removedNodes[0].classList &&
//    [...mutation.removedNodes[0].classList].length &&
//    [...mutation.removedNodes[0].classList].includes("VfPpkd-gIZMF")
//  ) {
//    getParty();
//    console.log(party);
//  }
//   }
