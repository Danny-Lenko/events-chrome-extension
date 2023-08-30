export interface GeneralServiceInterface {
  // for future implements
}

export interface Module {
    setup?(): void // here we indicated the point of start the module
}

export interface extensionConfigType {
    functionalities: Constructor<Module>[]
}

export type ServiceModuleRecord<T> = Record<string, T[keyof T]>

interface ModuleOptions {
  name: string
  setupFunction: () => void
  executors?: (() => void)[]
}

export interface ModuleDecoratorOptions<T> extends ModuleOptions {
  mainService: T[keyof T]
  services: ServiceModuleRecord<T>
}

export type Constructor<T> = new (services?: Object) => T

export type UNCHANGEABLE<T> = Readonly<T>

export type TypeURLs = Record<string, string>

export interface Target {
    config: extensionConfigType
    setConfig(config: extensionConfigType): void
    getConfig(): extensionConfigType
}
