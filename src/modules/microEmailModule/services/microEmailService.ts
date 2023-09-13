import {
   MicroEmailAlarmInterface,
   MicroEmailFallbackInterface,
   MicroEmailInterface,
   MicroEmailProcessMailsInterface,
} from '../types/microEmailInterfaces';
import { ServiceDecorator } from '../../../core/decorators/ServiceDecorator';
import { MicroEmailProcessMailsService } from './microEmailProcessMailsService';
import { MicroEmailFallbackService } from './microEmailFallbackService';
import { MicroEmailAlarmService } from './microEmailAlarmService';

import { RulesIntermediaryService } from '../../intermediaryServices/rulesIntermediaryService/rulesIntermediaryService';
import { RulesIntermediaryInterface } from '../../intermediaryServices/rulesIntermediaryService/rulesIntermediaryInterface';

@ServiceDecorator
export class MicroEmailService implements MicroEmailInterface {
   public executionIsAllowed = true;
   private filterString = '';

   private readonly observerTargetNode: HTMLElement = document.body;
   private readonly observerConfig: Record<string, boolean> = {
      childList: true,
      subtree: true,
   };

   constructor(
      public RulesService: RulesIntermediaryInterface = new RulesIntermediaryService(),
      public ProcessMailsService: MicroEmailProcessMailsInterface = new MicroEmailProcessMailsService(),
      public FallbackService: MicroEmailFallbackInterface = new MicroEmailFallbackService(),
      public AlarmService: MicroEmailAlarmInterface = new MicroEmailAlarmService(),
   ) {
      chrome.runtime.onMessage.addListener((message) => {
         if (message.action === 'userNavigatedBackOrForward') {
            this.executionIsAllowed = true;
            console.log(`Execution is allowed: ${this.executionIsAllowed}`);
         }
      });
   }

   private observer = new MutationObserver(async () => {
      const mails = document.getElementsByClassName('hcptT');
      const loadingOverlay = document.getElementById('loading-overlay');

      if (!mails[0] && this.executionIsAllowed) {
         this.handleNoMails(mails);
      }

      if (this.ProcessMailsService.confirmIsEmpty(mails)) {
         loadingOverlay?.remove();
      }

      this.ProcessMailsService.filterMails(mails, this.filterString);

      // const rules = await this.RulesService.getRules();
      // this.filterString = rules.emailServices.filterString;
   });

   private handleNoMails(mails) {
      this.FallbackService.generateFallback(this.ProcessMailsService.countDown);
      const countDownNode = this.FallbackService.countDownNode;

      const waitMailsInterval = setInterval(() => {
         this.ProcessMailsService.decreaseCountDown();
         countDownNode.textContent = this.ProcessMailsService.countDown + '';

         if (this.ProcessMailsService.confirmIsEmpty(mails)) {
            clearInterval(waitMailsInterval);
            this.allowExecution();
            this.ProcessMailsService.resetCountDown();
            return;
         }

         if (this.ProcessMailsService.countDown < 0) {
            clearInterval(waitMailsInterval);
            this.AlarmService.sendMessage();
            this.FallbackService.updateCountDown();
         }
      }, 1000);

      this.prohibitExecution();
   }

   private prohibitExecution() {
      this.executionIsAllowed = false;
   }

   public allowExecution() {
      this.executionIsAllowed = true;
   }

   async run() {
      const rules = await this.RulesService.getRules();
      this.filterString = rules.emailServices.filterString;

      console.log('Micro Mail service is working ---------------------!');

      return this.observer.observe(
         this.observerTargetNode,
         this.observerConfig,
      );
   }
}