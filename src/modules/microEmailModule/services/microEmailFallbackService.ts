import { MicroEmailFallbackInterface } from '../types/microEmailInterfaces';

export class MicroEmailFallbackService implements MicroEmailFallbackInterface {
   private overlayNode: Node;
   private spinnerNode: Node;
   private messageNode: Node;
   public countDownNode: Node;

   constructor() {}

   public generateFallback(countDown) {
      const styleSheet = document.styleSheets[0];
      styleSheet.insertRule(
         `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `,
         styleSheet.cssRules.length,
      );

      this.overlayNode = this.buildOverlay();
      this.spinnerNode = this.buildSpinner();
      this.messageNode = this.buildMessage();
      this.countDownNode = document.createElement('div');
      this.countDownNode.textContent = countDown + '';

      this.overlayNode.appendChild(this.spinnerNode);
      this.overlayNode.appendChild(this.messageNode);
      this.overlayNode.appendChild(this.countDownNode);

      document.body.appendChild(this.overlayNode);
   }

   public updateCountDown() {
      this.overlayNode.removeChild(this.countDownNode);
      this.messageNode.textContent =
         'Failed filtering mails. Admin has been informed';
   }

   private buildOverlay() {
      const overlay = document.createElement('div');
      overlay.id = 'loading-overlay';

      const overlayStyles = {
         fontSize: '16px',
         position: 'fixed',
         top: '0',
         left: '0',
         width: '100%',
         height: '100%',
         backgroundColor: '#ffffff',
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',
         zIndex: '9999',
      };

      for (const [key, value] of Object.entries(overlayStyles)) {
         overlay.style[key] = value;
      }

      return overlay;
   }

   private buildSpinner() {
      const spinner = document.createElement('div');

      const spinnerStyles = {
         border: '4px solid #3498db',
         borderTop: '4px solid transparent',
         borderRadius: '50%',
         width: '30px',
         height: '30px',
         animation: 'spin 1s linear infinite',
      };

      for (const [key, value] of Object.entries(spinnerStyles)) {
         spinner.style[key] = value;
      }

      return spinner;
   }

   private buildMessage() {
      const message = document.createElement('div');
      message.textContent = `Check If Inbox is Empty...`;
      message.style.marginTop = '20px';
      return message;
   }
}
