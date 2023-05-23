(() => {
   let myEvents = [];

   console.log('the micro calendar page')
 
   // const observer = new MutationObserver((mutationsList) => {
   //   const mutationBtns = document.querySelectorAll('[role="button"]');
   //   const eventElements = [...mutationBtns].filter(
   //     (el) => el.hasAttribute("data-eventchip") && el.childNodes.length === 3
   //   );
 
   //   if (eventElements.length) {
   //     eventElements.forEach((element) => {
   //       let data;
   //       const info = element.children[0].textContent.split(", ");
 
   //       info.forEach((item, i, arr) => {
   //         data = {
   //           time: arr[0],
   //           name: arr[1],
   //           author: arr[2],
   //           place: arr[3],
   //           date: arr[4],
   //         };
   //       });
   //       pushUniqueObject(myEvents, data);
   //     });
   //   }
   // });
 
   // const targetNode = document.body;
 
   // const observerConfig = {
   //   childList: true,
   //   subtree: true,
   // };
 
   // observer.observe(targetNode, observerConfig);
 
   // function pushUniqueObject(arr, obj) {
   //   const isDuplicate = arr.some(
   //     (item) => item.time === obj.time && item.date === obj.date
   //   );
 
   //   if (!isDuplicate) {
   //     arr.push(obj);
   //   }
   // }
 
   // setTimeout(() => myEvents.length && console.log(myEvents), 2000);

 })();
 
 