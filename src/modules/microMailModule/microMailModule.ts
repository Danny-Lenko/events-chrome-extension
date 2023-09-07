import { ModuleDecorator } from '../../core/decorators/ModuleDecorator';
import { AllInterfaces } from './types/microMailInterfaces';
import { MicroMailService } from './services/microMailService';

const microMailService = new MicroMailService();
@ModuleDecorator<AllInterfaces['interfaces']>({
   name: MicroMailService.name,
   mainService: microMailService,
   services: {
      [MicroMailService.name]: microMailService,
   },
   setupFunction: microMailService.run,
})
export class MicroMailModule {}
