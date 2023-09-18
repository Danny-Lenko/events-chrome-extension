import { ModuleDecorator } from '../../core/decorators/ModuleDecorator';
import { AllInterfaces } from '../googleCalendarModule/microCalendarInterfaces';
import { MicroCalendarService } from './services/microCalendarService';

const microCalendarService = new MicroCalendarService();
@ModuleDecorator<AllInterfaces['interfaces']>({
   name: MicroCalendarService.name,
   mainService: microCalendarService,
   services: {
      [MicroCalendarService.name]: microCalendarService,
   },
   setupFunction: microCalendarService.run,
})
export class MicroCalendarModule {}
