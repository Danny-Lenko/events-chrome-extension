import {GeneralServiceInterface} from "../../../core/coreInterfaces";

export interface MicroCalendarInterface extends GeneralServiceInterface {
  run(): void
}

export interface AllInterfaces {
  // interfaces needed to run module
  interfaces: {
    MicroCalendarInterface: MicroCalendarInterface
  }
}
