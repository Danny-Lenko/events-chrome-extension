import {ModuleDecoratorOptions} from "../coreInterfaces";

export class ModuleProvider<T> {
    private readonly _params: ModuleDecoratorOptions<T>

    constructor(params: ModuleDecoratorOptions<T>) {
        this._params = this.adaptParams(params)
    }

    get params() {
        return this._params
    }

    private adaptParams(params: ModuleDecoratorOptions<T>): ModuleDecoratorOptions<T> {
        return {
          name: params.name,
          mainService: params.mainService,
          services: params.services,
          executors: this.adaptExecutors(params),
          setupFunction: this.adaptSetupFunction(params),
        }
    }

    private adaptSetupFunction(params) {
       return this.verifyMethod(params, params.setupFunction).bind(params.mainService)
    }

    private adaptExecutors(params: ModuleDecoratorOptions<T>) {
        if (!params.executors || params.executors.length === 0) return params.executors
        return params.executors.map(m => this.verifyMethod(params, m))
    }

    private verifyMethod(params: ModuleDecoratorOptions<T>, method: () => void) {
        let inheritedClassNameMethod

        try {
          inheritedClassNameMethod = Object.getOwnPropertyDescriptors(method).classname.value
        } catch (e) {
          throw Error('Error in method has occurred if you have not followed these recommendations: 1) Use function declaration instead of function expression; 2) Use ServiceDecorator; (at moduleProvider)')
        }

        let verify: boolean

        for (let prop in params.services) {
          const service = params.services[prop]
          const serviceName = params.services[prop].constructor.prototype.constructor.classname

          verify = inheritedClassNameMethod === serviceName

          if (verify) {
            break
          } else {
            verify = this.verifyWithDerivativeServices<T>(service, inheritedClassNameMethod)
            if (verify) {
              break
            }
          }
        }

        if (!verify) throw Error('Error has occurred if you have not followed these recommendations: 1) You have to use reference to your service or method; 2) Setup method must belong to main service but it is not; (at moduleProvider)')

        return method
    }

    private verifyWithDerivativeServices<T>(service: T[keyof T], inheritedClassNameMethod: string) {
        const propertyNameArr = Object.entries(service)
        let exist: boolean = false

        for (let i = 0; i < propertyNameArr.length; i++) {
          const nameOfInnerProperty = propertyNameArr[i][1] && Object.getPrototypeOf(propertyNameArr[i][1]).constructor.name
          const verify = nameOfInnerProperty === inheritedClassNameMethod

          if (verify) {
            exist = true
            break
          }
        }

        return exist
    }

}
