const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const UglifyJS = require('uglify-js')

const srcFolder = path.resolve(__dirname, '../../')
const extensionOptionsFolder = path.resolve(srcFolder, './extensionOptions')
const distFolder = path.resolve(srcFolder, '../dist')

const backgroundFolder = path.resolve(extensionOptionsFolder, './backgrounds')
const manifestPath = path.resolve(extensionOptionsFolder, './manifest.json')

function updaterExtensionAdditional() {
    if (!fs.existsSync(path.resolve(extensionOptionsFolder, manifestPath))) throw Error('You must create manifest file in \'working-extension-directory/src/extensionOptions\'')

    try {
      fse.copySync(manifestPath, path.join(distFolder, 'manifest.json'))
    } catch (e) {
      console.error('Error copying file:', e)
    }

    if (fs.existsSync(path.resolve(extensionOptionsFolder, backgroundFolder))) {
      const backgrounds = []

      for (const file of fs.readdirSync(backgroundFolder)) {
        const backgroundFile = fs.readFileSync(`${backgroundFolder}/${file}`, 'utf-8')
        backgrounds.push(backgroundFile)
      }

      const mergedBackgrounds = UglifyJS.minify(backgrounds.join(''))
      fs.writeFileSync(`${distFolder}/background.js`, mergedBackgrounds.code, 'utf-8')

      const distManifest = `${distFolder}/manifest.json`
      const manifest = JSON.parse(fs.readFileSync(distManifest, 'utf-8'))
      manifest.background = { "service_worker": "background.js" }

      fs.writeFileSync(distManifest, JSON.stringify(manifest, null, 2), 'utf-8')
    } else {
      console.warn('Background files has to be in \'working-extension-directory/src/extensionOptions/backgrounds\'')
    }
}

module.exports = updaterExtensionAdditional
