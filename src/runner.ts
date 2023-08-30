import { modules } from './modules';
import { ExtensionCoreModule } from './core/extensionCoreModule';
import { ExtensionConfig } from './core/decorators/ExtensionConfig';
import { extensionConfigType } from './core/coreInterfaces';

const config: extensionConfigType = {
   functionalities: modules,
};

@ExtensionConfig(config)
class Config {
   public static config: extensionConfigType;

   static getConfig() {
      return this.config;
   }

   static setConfig(config: extensionConfigType) {
      this.config = config;
   }
}

const extension = new ExtensionCoreModule(Config.getConfig());

extension.setup();
