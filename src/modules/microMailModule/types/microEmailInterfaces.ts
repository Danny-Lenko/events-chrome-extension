import { GeneralServiceInterface } from '../../../core/coreInterfaces';

export interface MicroEmailInterface extends GeneralServiceInterface {
   run(): void;
}

export interface MicroEmailProcessMailsInterface
   extends GeneralServiceInterface {
   handleNoMails(mails: HTMLCollectionOf<Element>): void;
}

export interface MicroEmailFallbackInterface extends GeneralServiceInterface {
   generateFallback(countDownOrigin: number): {
      loadingOverlay: Node;
      countDownMessage: Node;
      loadingMessage: Node;
   };
}

export interface AllInterfaces {
   // interfaces needed to run module
   interfaces: {
      MicroEmailInterface: MicroEmailInterface;
   };
}
