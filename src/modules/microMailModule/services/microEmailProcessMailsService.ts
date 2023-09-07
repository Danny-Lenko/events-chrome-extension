import {
   MicroEmailProcessMailsInterface,
   MicroEmailFallbackInterface,
} from '../types/microEmailInterfaces';
import { MicroEmailFallbackService } from './microEmailFallbackService';

export class MicroEmailProcessMailsService
   implements MicroEmailProcessMailsInterface
{
   private readonly countdownOrigin = 3;

   constructor(
      public FallbackService: MicroEmailFallbackInterface = new MicroEmailFallbackService(),
   ) {}

   public handleNoMails(mails) {
      const { loadingOverlay, countDownMessage, loadingMessage } =
         this.FallbackService.generateFallback(this.countdownOrigin);

      

      // document.body.appendChild(loadingOverlay);

      console.log('handling no mails');
   }
}
