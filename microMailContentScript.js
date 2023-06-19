// let mailNodesFiltered = [];
const filterString = "filter";
const reg = new RegExp(filterString, "ig");

// =========================================================== observer

const observerNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

const observer = new MutationObserver((mutationsList) => {
  //   const mailNodes =
  //     document.getElementsByClassName("jEpCF")[0].childNodes[0].childNodes;

//   const mailsContainer = document.getElementsByClassName

  const mailNodes = [
    ...document.getElementsByClassName("jEpCF")[0].children[0].children,
  ];

  const mailNodesFiltered = mailNodes.filter((mail) => {
    const mailNode = mail.children[0].children[0];
    //  console.log(content.children[0].children[0].getAttribute("aria-label"));
    if (mailNode) {
      // console.log(content.getAttribute("aria-label"));
      const content = mailNode.getAttribute("aria-label");
      if (content && !content.match(reg)) {
        return mail;
      }
    }
  });
  console.log(mailNodesFiltered);


});

// ======================================================== content script

(() => {
  //   setTimeout(() => {
  //     getEvents();
  //     initialEvents = [...events];
  //     console.log(initialEvents);

  //     weekDateNode = document.getElementsByClassName("YjxmP");
  //     weekDateContent = weekDateNode.length && weekDateNode[0].textContent;
  //   }, initialTimeout);

  //   setTimeout(() => {
  //     observer.observe(observerNode, observerConfig);
  //   }, observerTimeout);

  observer.observe(observerNode, observerConfig);
})();
