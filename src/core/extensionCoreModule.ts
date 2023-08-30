import { extensionConfigType, Module } from "./coreInterfaces";

export class ExtensionCoreModule {
  // Module creates main logic of program.
  // Don't use it to work.
  private modules: Module[];
  constructor(config: extensionConfigType) {
    this.modules = config.functionalities.map((Module) => {
      return new Module();
    });
  }

  public setup() {
    this.modules.forEach((m) => m.setup());
  }
}
