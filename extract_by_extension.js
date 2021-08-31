
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import OrganizerUtils from './utils/organizer_utils.js'
import Logger from './utils/logger.js'

class ExtractByExtension {

    constructor(pathOrigin, pathDestiny) {
        this.pathOrigin = pathOrigin
        this.pathDestiny = pathDestiny
        this.destinyFiles = new Set()
        this.destinyFolders = new Set()
        this.logger = new Logger()
        this.organizerUtils = new OrganizerUtils()
    }

    extract() {
        this.logger.startProcess()

        this.extractRecursive(this.pathOrigin)

        this.logger.endProcess()
    }

    extractRecursive(folder) {
        let itens = this.organizerUtils.getContentFromPath(folder)

        itens.forEach(item => {
            let pathItemOrigin = `${folder}/${item}`

            if (this.organizerUtils.isDirectory(pathItemOrigin)) {
                this.extractRecursive(pathItemOrigin)
            } else {
                let extension = this.organizerUtils.getExtension(pathItemOrigin).replace('.', '')
                if (extension.length == 0) {
                    extension = 'indefinido'
                } 
    
                let pathDestinyFolder = `${this.pathDestiny}/${extension}`
    
                if (this.existsFolderOnDestiny(pathDestinyFolder)) {
                    this.logger.logInfo(`The folder ${pathDestinyFolder} exists \n`)
                } else {
                    this.createFolderOnDestiny(pathDestinyFolder)
                }
    
                let pathItemDestiny = `${pathDestinyFolder}/${item}`
                if (!this.existsFileOnDestiny(pathItemDestiny)) {
                    this.copyFileToDestiny(pathItemOrigin, pathItemDestiny)
                }
            }
        })
    }

    copyFileToDestiny(pathItemOrigin, pathItemDestiny) {
        this.logger.logInfo(`Coping the file ${pathItemOrigin} to ${pathItemDestiny} \n`)
        copyFileSync(pathItemOrigin, pathItemDestiny)
        this.destinyFiles.add(pathItemDestiny)
    }

    createFolderOnDestiny(folder) {
        this.logger.logInfo(`The folder ${folder} not exists, creating... \n`)
        mkdirSync(folder, { recursive: true }, (err) => {
            if (err) throw err
        })  
        this.destinyFolders.add(folder)
    }

    existsFileOnDestiny(subFolder, file) {
        return this.destinyFiles.has(`${this.pathDestiny}/${subFolder}/${file}`)
    }

    existsFolderOnDestiny(folder) {
        return this.destinyFolders.has(folder)
    }

    // DEPRECATED
    /*
    existsFileOnDestiny(pathItemDestiny) {
        this.logger.logInfo(`The file was ignore ${pathItemDestiny} but alread exists \n`)
        return existsSync(pathItemDestiny)
    }

    existsFolderOnDestiny(folder) {
        return existsSync(folder)
    }
    */
}

new ExtractByExtension('D:/Distribuir', 'D:/DistribuirSeparadosPorExt').extract()