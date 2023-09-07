import {GoogleCalendarInterface} from "../types/googleCalendarInterfaces";
import {ServiceDecorator} from "../../../core/decorators/ServiceDecorator";

@ServiceDecorator
export class GoogleCalendarService implements GoogleCalendarInterface {

  constructor(

  ) {}

  run() {
    return console.log('Calendar service is working ---------------------!')
  }

}
