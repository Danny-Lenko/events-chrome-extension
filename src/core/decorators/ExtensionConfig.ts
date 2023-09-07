import {extensionConfigType, Target} from "../coreInterfaces";
import {URLs} from "../coreConsts";

export function ExtensionConfig(config: extensionConfigType) {
    // Decorator helps select needed module which depends on current URL
    return function (target: Target) {
        const currentUrl = getCurrentUrl()
        const neededModulesConfig = matchModuleToUrl(config, currentUrl)
        target.setConfig(neededModulesConfig)
    }
}

function matchModuleToUrl(config: extensionConfigType, currentUrl: string) {
    return {
        functionalities: config.functionalities.filter(Module => {
            const moduleUrl = URLs[Module.name]
            return checkUrl(moduleUrl, currentUrl)
        })
    }
}

function checkUrl(url: string, currentUrl: string) {
    const kindModuleUrl = new URL(url)
    const { protocol, path, hostname } = {
        protocol: currentUrl.includes(kindModuleUrl.protocol),
        hostname: currentUrl.includes(replacer(kindModuleUrl.hostname)),
        path: kindModuleUrl.pathname.startsWith('/*') ? true : currentUrl.includes(replacer(kindModuleUrl.pathname)),
    }

    return protocol && hostname && path
}

function getCurrentUrl() {
    return window.location.href
}

function replacer (pathname: string) {
    // This function return url without star or dot (after converting url via url Object start are converting to %2A)
    return pathname.replace(/(\.(\*|%2A)|(\*|%2A)\.|(\*|%2A))/g, '')
}
