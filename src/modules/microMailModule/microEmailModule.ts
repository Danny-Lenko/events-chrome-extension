import { ModuleDecorator } from '../../core/decorators/ModuleDecorator';
import { AllInterfaces } from './types/microEmailInterfaces';
import { MicroEmailService } from './services/microEmailService';

const microMailService = new MicroEmailService();
@ModuleDecorator<AllInterfaces['interfaces']>({
   name: MicroEmailService.name,
   mainService: microMailService,
   services: {
      [MicroEmailService.name]: microMailService,
   },
   setupFunction: microMailService.run,
})
export class MicroMailModule {}
