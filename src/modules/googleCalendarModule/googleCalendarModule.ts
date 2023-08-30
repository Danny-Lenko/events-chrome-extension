import {ModuleDecorator} from "../../core/decorators/ModuleDecorator";
import { AllInterfaces } from "./types/googleCalendarInterfaces";
import {GoogleCalendarService} from "./services/googleCalendarService";

const googleCalendarService = new GoogleCalendarService()
@ModuleDecorator<AllInterfaces['interfaces']>({
    name: GoogleCalendarService.name,
    mainService: googleCalendarService,
    services: {
      [GoogleCalendarService.name]: googleCalendarService
    },
    setupFunction: googleCalendarService.run,
})
export class GoogleCalendarModule {}
