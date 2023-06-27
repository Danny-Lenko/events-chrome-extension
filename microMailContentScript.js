const filterString = "football";
const reg = new RegExp(filterString, "ig");

// =========================================================== observer

const observerNode = document.body;

const observerConfig = {
  childList: true,
  subtree: true,
};

const observer = new MutationObserver((mutationsList) => {
  const mails = document.getElementsByClassName("EeHm8");

  [...mails].forEach((node) => {
    const contentNode =
      node.children.length > 1 ? node.children[1] : node.children[0];

    if (contentNode) {
      const content = contentNode.getAttribute("aria-label");

      if (content && content.match(reg)) {
        node.style.display = "none";
      }
    }
  });
});

// ======================================================== content script

(() => {
  observer.observe(observerNode, observerConfig);
})();
