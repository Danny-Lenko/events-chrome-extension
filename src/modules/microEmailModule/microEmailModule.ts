import { ModuleDecorator } from '../../core/decorators/ModuleDecorator';
import { AllInterfaces } from '../microEmailModule/types/microEmailInterfaces';
import { MicroEmailService } from '../microEmailModule/services/microEmailService';

const microEmailService = new MicroEmailService();
@ModuleDecorator<AllInterfaces['interfaces']>({
   name: MicroEmailService.name,
   mainService: microEmailService,
   services: {
      [MicroEmailService.name]: microEmailService,
   },
   setupFunction: microEmailService.run,
})
export class MicroEmailModule {
   static checkMessage() {
      throw new Error('Method not implemented.');
   }
   public checkMessage() {
      console.log('got message');
   }
}


