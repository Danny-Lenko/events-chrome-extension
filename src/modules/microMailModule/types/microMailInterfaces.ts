import {GeneralServiceInterface} from "../../../core/coreInterfaces";

export interface MicroMailInterface extends GeneralServiceInterface {
  run(): void
}

export interface AllInterfaces {
  // interfaces needed to run module
  interfaces: {
    MicroMailInterface: MicroMailInterface
  }
}
