import { RulesIntermediaryInterface } from './rulesIntermediaryInterface';
import mockRules from '../../../../config.json';

export class RulesIntermediaryService implements RulesIntermediaryInterface {
   private fixedIV;

   constructor() {}

   public async getRules() {
      try {
         const rules =
            (await this.fetchServerRules()) || (await this.getStorageRules());
         return rules;
      } catch (error) {
         console.error('Error getting storage data:', error);
         return mockRules;
      }
   }

   public async fetchServerRules() {
      this.fixedIV = await this.generateIV();

      try {
         const response = await fetch('http://localhost:8080/rules');
         if (!response.ok) {
            throw new Error('Request failed with status: ' + response.status);
         }
         const data = await response.json();
         this.setStorageRules(data);

         return JSON.parse(data);
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   }

   private setStorageRules(data) {
      this.generateEncryptionKey().then(async (key) => {
         const encrypted = await this.encryptMessage(key, data);

         // the TS chunk to avoid downlevelIteration setting change
         const uint8Array = new Uint8Array(encrypted);
         const uint8ArrayAsArray = Array.from(uint8Array);
         const encryptedString = btoa(
            String.fromCharCode(...uint8ArrayAsArray),
         );

         chrome.storage.local.set(
            { extensionSettings: encryptedString },
            () => {
               console.log('Encrypted data saved to storage');
            },
         );

         // Store the rawKey in the Chrome storage
         window.crypto.subtle
            .exportKey('raw', key)
            .then((rawKey) => {
               chrome.storage.local.set({
                  encryptionKey: Array.from(new Uint8Array(rawKey)),
               });
            })
            .catch((error) => {
               console.error('Key export error:', error);
            });
      });
   }

   private getStorageRules() {
      console.log('storage reached');

      return new Promise((resolve, reject) => {
         chrome.storage.local.get('extensionSettings', async (storageData) => {
            if (chrome.runtime.lastError) {
               reject(chrome.runtime.lastError);
               return;
            }

            const settings = await storageData.extensionSettings;

            if (!settings) {
               reject('No extension settings in storage yet');
               return;
            }

            const encryptedBuffer = new Uint8Array(
               atob(storageData.extensionSettings)
                  .split('')
                  .map((c) => c.charCodeAt(0)),
            );

            const decrypted = await this.decryptMessage(encryptedBuffer);

            const rules = JSON.parse(decrypted);
            resolve(rules);
         });
      });
   }

   private async decryptMessage(ciphertext) {
      const { encryptionKey } = await new Promise<{
         encryptionKey?: ArrayBufferLike;
      }>((resolve) =>
         chrome.storage.local.get('encryptionKey', (result) => resolve(result)),
      );

      const importedKey = await window.crypto.subtle.importKey(
         'raw',
         new Uint8Array(encryptionKey),
         { name: 'AES-GCM' },
         true,
         ['encrypt', 'decrypt'],
      );

      if (importedKey) {
         const buffer = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: this.fixedIV },
            importedKey,
            ciphertext,
         );

         const dec = new TextDecoder();
         return dec.decode(buffer);
      }
   }

   private async generateEncryptionKey() {
      return window.crypto.subtle.generateKey(
         {
            name: 'AES-GCM',
            length: 256,
         },
         true,
         ['encrypt', 'decrypt'],
      );
   }

   private async generateIV() {
      const secretValue = 'mySecretValue';
      const encoder = new TextEncoder();
      const data = encoder.encode(secretValue);
      return await crypto.subtle.digest('SHA-256', data);
   }

   private async encryptMessage(key, data) {
      const enc = new TextEncoder();
      const encoded = enc.encode(data);

      return await window.crypto.subtle.encrypt(
         {
            name: 'AES-GCM',
            iv: this.fixedIV,
         },
         key,
         encoded,
      );
   }
}
