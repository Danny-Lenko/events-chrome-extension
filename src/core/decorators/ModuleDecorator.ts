import {Module, ModuleDecoratorOptions, ServiceModuleRecord} from "../coreInterfaces";
import {ModuleProvider} from "../providers/moduleProvider";

export function ModuleDecorator<T>(params: ModuleDecoratorOptions<T>) {
  // This decorator helps create a derivative module of program.
  // Write here services you want to use but remember if you have only one point to run your module(script),
  // put to braces a method of launch your module in setupFunction properties.
  // The parameters object have third option is called executors where you can put in the functions you want to execute after module logic will have been working on the web page.
    return function <U extends new (...args: any[]) => any>(target: U) {
        class ModuleWithServices extends target implements Module {
            private readonly services: T
            private readonly _params:  ModuleDecoratorOptions<T>

            constructor(...args: any[]) {
                super(...args)
                const provider = new ModuleProvider<T>(params)
                this._params = provider.params

                this.services = this.initializeServices<T>(this._params.services)
            }

            public setup() {
                this._params.setupFunction()
                this.setupAdditionalMethods(this._params.executors)
            }

            private initializeServices<T>(services: ServiceModuleRecord<T>): T {
                const temporary = {} as T

                for (let Service in services) {
                    temporary[Service] = services[Service]
                }

                return temporary
            }

            private setupAdditionalMethods(methods: (() => void)[]) {
                if (!methods || methods.length === 0) return
                methods.forEach((method) => method())
            }
        }

        Object.defineProperty(ModuleWithServices, "name", { value: params.name })

        return ModuleWithServices
    }
}
