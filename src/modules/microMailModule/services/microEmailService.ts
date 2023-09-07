import {
   MicroEmailInterface,
   MicroEmailProcessMailsInterface,
} from '../types/microEmailInterfaces';
import { ServiceDecorator } from '../../../core/decorators/ServiceDecorator';
import { MicroEmailProcessMailsService } from './microEmailProcessMailsService';

@ServiceDecorator
export class MicroEmailService implements MicroEmailInterface {
   private executionIsAllowed = true;

   private readonly observerTargetNode: HTMLElement = document.body;
   private readonly observerConfig: Record<string, boolean> = {
      childList: true,
      subtree: true,
   };

   constructor(
      public NoMailsService: MicroEmailProcessMailsInterface = new MicroEmailProcessMailsService(),
   ) {}

   private observer = new MutationObserver(() => {
      const mails = document.getElementsByClassName('hcpt');
      const loadingOverlay = document.getElementById('loading-overlay');

      console.log(mails);

      if (!mails[0] && this.executionIsAllowed) {
         this.NoMailsService.handleNoMails(mails);
         this.executionIsAllowed = false;
      }

      // if (checkIsEmpty(mails)) {
      //    loadingOverlay?.remove();
      // }

      // filterMails(mails);
   });

   public prohibitExecution() {
      this.executionIsAllowed = false;
   }

   public allowExecution() {
      this.executionIsAllowed = true;
   }

   run() {
      console.log('Micro Mail service is working ---------------------!');
      return this.observer.observe(
         this.observerTargetNode,
         this.observerConfig,
      );
   }
}
