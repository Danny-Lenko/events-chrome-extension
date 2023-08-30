# How to use app application and create a new functionality easier

# How does it work

  Architecture of the extension based on `module-controller-service` architecture, but it was decided to get rid of controllers because their part of functionality overloads the main logic.
  First of all, you need to understand the runner file is main file with logic of running the application.
  There you can see decorator `@ExtensionConfig` which serves in order to select needed module for current URL while app is working in browser.
  All modules are in `modules/index.ts` where they export to runner.ts in config object which contains modules which extension is going to use on the webpages.
  You don't need to change or modify this main module.
  Your modification and changes have to be in modules directory.
  Modules from `modules/index.ts` is running by `ExtensionCoreModule` which is the point of running selected module or modules.
  
### 1. Create a new module:

  1. Go to module file and create new directory which has to be called as the main file of your new module in it.\
  2. Use decorator whose name is ModuleDecorator. There you need to put your services and the function of running your module logic in the params object.\
  3. There is another option which is called `executors`. It proposes to execute in browser additional logic of your module, besides your main function of running.\
  4. Create a directory types and there create file using name of your module without part of "Module" and instead write "Interfaces" and another one which is "Types" in name instead of "Module".\
    4.1 In interfaces file create `AllInterfaces` interface where put a property object which contains properties of all interfaces for services in your module. Property name must be equal to name of interface.\
    4.2 All interfaces have to extend `GeneralServiceInterface`.\
  5. Put in generic type AllInterfaces property object interfaces.\
  6. After all operation when your module is ready for testing you need to export it to module/index.ts and put in array of modules.\

### 2. Create a new service:

  1. When you created your module directory and module of functionality, or you want to add a new service to existing module, go to services directory or create the service directory.\
  2. There create a new class and name it using name of module to which it belongs. Replace a part of name module with services in order to indicate its functionality purpose. (Module to Service)\
  3. The class has to implement appropriate interface from directory types/[...Interfaces]\
  4. if your service has a lot of logic divide it into parts in other services and use injection to include that parts to your main service.\
  
## How to use with one bundle or how you can run the app
  
  1. Go to `package.json`, and you will see build script and dev script.\
  2. The first run build version, after use dev version to develop.\ 

## About core part
    
  ### Core uses decorators whose logic described in files, but you can see it if you hover cursor over decorator name.
  ### If you want to add a new logic to core you need to notice team lead of extension about your plans.
