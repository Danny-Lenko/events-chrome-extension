function MethodDecorator(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.value.classname = target.constructor.name
  return descriptor
}

export function ServiceDecorator<T extends new (...args: any[]) => {}>(service: T) {
  const proto = service.prototype
  const methodNames = Object.getOwnPropertyNames(proto)

  methodNames.forEach((methodName) => {
    const methodDescriptor = Object.getOwnPropertyDescriptor(proto, methodName)
    if (methodDescriptor && typeof methodDescriptor.value === "function") {
      MethodDecorator(proto, methodName, methodDescriptor)
    }
  })

  Object.defineProperty(service, "classname", { value: service.name })

  return service
}
