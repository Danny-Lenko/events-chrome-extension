import { MicroEmailAlarmInterface } from '../types/microEmailInterfaces';

export class MicroEmailAlarmService implements MicroEmailAlarmInterface {
   constructor() {}

   public sendMessage = async () => {
      try {
         const res = await fetch('http://localhost:8080/error-ms-email', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/JSON',
            },
            body: '',
         });
         if (!res.ok) {
            throw new Error('Request failed with status: ' + res.status);
         }
         const resData = await res.json();
         console.log(resData);
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };
}
