import { MicroEmailFallbackInterface } from '../types/microEmailInterfaces';

export class MicroEmailFallbackService implements MicroEmailFallbackInterface {
   constructor() {}

   public generateFallback(countDownOrigin) {
      const loadingOverlay = this.buildOverlay();
      const loadingSpinner = this.buildSpinner();
      const loadingMessage = this.buildMessage();

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

      const countDownMessage = document.createElement('div');
      countDownMessage.textContent = countDownOrigin;

      loadingOverlay.appendChild(loadingSpinner);
      loadingOverlay.appendChild(loadingMessage);
      loadingOverlay.appendChild(countDownMessage);

      return { loadingOverlay, countDownMessage, loadingMessage };
   }

   private buildOverlay() {
      const overlay = document.createElement('div');
      overlay.id = 'loading-overlay';

      const overlayStyles = {
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
