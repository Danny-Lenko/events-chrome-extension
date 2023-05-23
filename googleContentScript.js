(() => {
  let myEvents = [];

  const observer = new MutationObserver((mutationsList) => {
    const mutationBtns = document.querySelectorAll('[role="button"]');
    const eventElements = [...mutationBtns].filter(
      (el) => el.hasAttribute("data-eventchip") && el.childNodes.length === 3
    );

    if (eventElements.length) {
      eventElements.forEach((element) => {
        let data;
        const info = element.children[0].textContent.split(", ");

        info.forEach((item, i, arr) => {
          data = {
            time: arr[0],
            name: arr[1],
            author: arr[2],
            place: arr[3],
            date: arr[4],
          };
        });
        pushUniqueObject(myEvents, data);
      });
    }
  });

  const targetNode = document.body;

  const observerConfig = {
    childList: true,
    subtree: true,
  };

  observer.observe(targetNode, observerConfig);

  function pushUniqueObject(arr, obj) {
    const isDuplicate = arr.some(
      (item) => item.time === obj.time && item.date === obj.date
    );

    if (!isDuplicate) {
      arr.push(obj);
    }
  }

  setTimeout(() => myEvents.length && console.log(myEvents), 2000);
})();


  // let youtubeLeftControls, youtubePlayer;
  // let currentVideo = "";
  // let currentVideoBookmarks = [];

  // const buttons = document.querySelectorAll('[role="button"]')
  // console.log(buttons)

  // const fetchBookmarks = () => {
  //   return new Promise((resolve) => {
  //     chrome.storage.sync.get([currentVideo], (obj) => {
  //       resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
  //     });
  //   });
  // };

  // const addNewBookmarkEventHandler = async () => {
  //   const currentTime = youtubePlayer.currentTime;
  //   const newBookmark = {
  //     time: currentTime,
  //     desc: "Bookmark at " + getTime(currentTime),
  //   };

  //   currentVideoBookmarks = await fetchBookmarks();

  //   chrome.storage.sync.set({
  //     [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
  //   });
  // };

  // const newVideoLoaded = async () => {
  //   const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

  //   currentVideoBookmarks = await fetchBookmarks();

  //   if (!bookmarkBtnExists) {
  //     const bookmarkBtn = document.createElement("img");

  //     bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
  //     bookmarkBtn.className = "ytp-button " + "bookmark-btn";
  //     bookmarkBtn.title = "Click to bookmark current timestamp";

  //     youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
  //     youtubePlayer = document.getElementsByClassName('video-stream')[0];

  //     youtubeLeftControls.appendChild(bookmarkBtn);
  //     bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
  //   }
  // };

  // chrome.runtime.onMessage.addListener((obj, sender, response) => {
  //   const { type, value, videoId } = obj;

  //   if (type === "NEW") {
  //     currentVideo = videoId;
  //     newVideoLoaded();
  //   } else if (type === "PLAY") {
  //     youtubePlayer.currentTime = value;
  //   } else if ( type === "DELETE") {
  //     currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
  //     chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });

  //     response(currentVideoBookmarks);
  //   }
  // });

  // newVideoLoaded();

