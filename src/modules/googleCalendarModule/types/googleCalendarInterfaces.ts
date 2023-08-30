import {GeneralServiceInterface} from "../../../core/coreInterfaces";

export interface GoogleCalendarInterface extends GeneralServiceInterface {
  run(): void
}

export interface AllInterfaces {
  // interfaces needed to run module
  interfaces: {
    GoogleCalendarInterface: GoogleCalendarInterface
  }
}
