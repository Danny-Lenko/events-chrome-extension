chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
   const targetUrl = 'https://outlook.live.com/mail';

   if (
      details.transitionQualifiers &&
      details.transitionQualifiers[0] === 'forward_back' &&
      details.url.startsWith(targetUrl)
   ) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
         if (tabs[0]) {
            chrome.tabs.sendMessage(
               tabs[0].id,
               { action: 'userNavigatedBackOrForward' },
               (response) => {},
            );
         }
      });
   }
});
