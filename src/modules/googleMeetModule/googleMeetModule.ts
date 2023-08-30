import {ModuleDecorator} from "../../core/decorators/ModuleDecorator";
import { AllInterfaces } from "./types/googleMeetInterfaces";
import {GoogleMeetService} from "./services/googleMeetService";

const googleMeetService = new GoogleMeetService()

@ModuleDecorator<AllInterfaces['interfaces']>({
    name: GoogleMeetService.name,
    mainService: googleMeetService,
    services: {
        [GoogleMeetService.name]: googleMeetService
    },
    setupFunction: googleMeetService.runObserve,
    executors: [ // for example
      googleMeetService.FetchService.getMock,
    ]
})
export class GoogleMeetModule {}
