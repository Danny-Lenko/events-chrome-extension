let keepTabActiveMode=!1,activeTabId=null,tabSwitchTimer=null;function setActiveTab(){chrome.tabs.query({active:!0,currentWindow:!0},e=>{e&&0<e.length&&(e=e[0]).url.includes("meet.google.com")&&(activeTabId=e.id)})}chrome.runtime.onMessage.addListener(e=>{if("enterFullScreen"===e.action){let i=!1,a=void 0,c;chrome.tabs.query({active:!0,windowType:"normal",currentWindow:!0},e=>{if(c=e[0].id,e[0].url.includes("meet.google.com")){const t=e[0].windowId;chrome.tabs.update(c,{active:!0},()=>{chrome.windows.update(t,{state:"fullscreen"})})}chrome.tabs.query({},e=>{for(var t=0;t<e.length;t++)e[t].audible&&(i=!0,a=e[t].id,winId=e[t].windowId);1==i&&a!=c&&chrome.tabs.update(a,{active:!0},()=>{chrome.windows.update(winId,{state:"fullscreen"})})})})}if("enterFullScreenJoin"===e.action){let i;chrome.tabs.query({active:!0,windowType:"normal",currentWindow:!0},e=>{if(i=e[0].id,e[0].url.includes("meet.google.com")){const t=e[0].windowId;chrome.tabs.update(i,{active:!0},()=>{chrome.windows.update(t,{state:"fullscreen"})})}})}"keepTabActive"===e.action&&(keepTabActiveMode=!0,setActiveTab()),"disableFullScreen"===e.action&&chrome.tabs.query({active:!0,windowType:"normal",currentWindow:!0},e=>{let t=t=e[0].id;if(e[0].url.includes("meet.google.com")){const i=e[0].windowId;chrome.tabs.update(t,{active:!0},()=>{chrome.windows.update(i,{state:"normal"})})}})}),chrome.tabs.onUpdated.addListener((e,t,i)=>{keepTabActiveMode&&i.url.includes("meet.google.com")&&(activeTabId=e)}),chrome.tabs.onActivated.addListener(e=>{keepTabActiveMode&&activeTabId&&activeTabId!==e.tabId&&(tabSwitchTimer&&clearTimeout(tabSwitchTimer),tabSwitchTimer=setTimeout(()=>{chrome.tabs.update(activeTabId,{active:!0})},300))});