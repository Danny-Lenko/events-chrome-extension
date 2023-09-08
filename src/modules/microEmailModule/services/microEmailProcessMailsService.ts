import { MicroEmailProcessMailsInterface } from '../types/microEmailInterfaces';

export class MicroEmailProcessMailsService
   implements MicroEmailProcessMailsInterface
{
   public countDown = 3;

   constructor() {}

   public decreaseCountDown() {
      this.countDown--;
   }

   public resetCountDown() {
      this.countDown = 3;
   }

   public confirmIsEmpty(mails) {
      const emptyNode = document.getElementById('EmptyState_MainMessage');
      const secondaryNode = document.getElementsByClassName('TrKke')[0];

      const isEmpty =
         mails[0] ||
         (emptyNode && emptyNode.innerText !== 'Select an item to read') ||
         (secondaryNode && secondaryNode.innerHTML !== 'Nothing is selected');

      return isEmpty;
   }

   public filterMails(mails, filterString) {
      const filterRegex = new RegExp(filterString, 'ig');

      [...mails].forEach((node) => {
         const content = node.getAttribute('aria-label');

         if (content && !content.match(filterRegex)) {
            node.parentElement.parentElement.style.display = 'block';
         }

         if (content && content.match(filterRegex)) {
            node.parentElement.parentElement.style.display = 'none';
         }
      });
   }
}
