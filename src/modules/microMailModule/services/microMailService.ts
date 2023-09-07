import { MicroMailInterface } from '../types/microMailInterfaces';
import { ServiceDecorator } from '../../../core/decorators/ServiceDecorator';

@ServiceDecorator
export class MicroMailService implements MicroMailInterface {
   constructor() {}

   run() {
      return console.log(
         'Micro Mail service is working ---------------------!',
      );
   }
}
