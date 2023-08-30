import {MicroCalendarInterface} from "../types/microCalendarInterfaces";
import {ServiceDecorator} from "../../../core/decorators/ServiceDecorator";

@ServiceDecorator
export class MicroCalendarService implements MicroCalendarInterface {

  constructor(

  ) {}

  run() {
    return console.log('Micro Calendar service is working ---------------------!')
  }

}
