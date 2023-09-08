import { GeneralServiceInterface } from '../../../core/coreInterfaces';

export interface MicroEmailInterface extends GeneralServiceInterface {
   run(): void;
}

export interface MicroEmailProcessMailsInterface
   extends GeneralServiceInterface {
   countDown: number;
   decreaseCountDown(): void;
   resetCountDown(): void;
   confirmIsEmpty(mails: HTMLCollectionOf<Element>): Node | boolean;
   filterMails(mails: HTMLCollectionOf<Element>, filterString: string): void;
}

export interface MicroEmailFallbackInterface extends GeneralServiceInterface {
   countDownNode: Node;
   generateFallback(countDown: number): void;
   updateCountDown(): void;
}

export interface MicroEmailAlarmInterface extends GeneralServiceInterface {
   sendMessage(): void;
}

export interface AllInterfaces {
   // interfaces needed to run module
   interfaces: {
      MicroEmailInterface: MicroEmailInterface;
   };
}
