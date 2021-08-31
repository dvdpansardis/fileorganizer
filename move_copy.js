import Logger from './utils/logger.js'
import OrganizerUtils from './utils/organizer_utils.js'

class MoveCopy {

    constructor(pathOrigin, pathDestiny) {
        this.pathOrigin = pathOrigin
        this.pathDestiny = pathDestiny
        this.destinyFiles = new Set()
        this.mapDestinyFiles = {}
        this.logger = new Logger()
        this.organizerUtils = new OrganizerUtils()
        this.foundFolders = new Set()
    }

    move() {
        this.logger.startProcess()

        this.hasProblem = false
        
        this.loadDestinyFiles(this.pathDestiny)

        this.moveRecursive(this.pathOrigin)

        if(this.hasProblem) {
            console.log(`\n *** HAS PROBLEM, SEE THE LOG *** \n`)
        }

        console.log(`\n Folders not found \n`)
        this.logger.logInfo(`\n Folders not found \n`)
        this.foundFolders.forEach(f => {
            this.logger.logInfo(f)
            console.log(f)
        });

        this.logger.endProcess()
    }

    loadDestinyFiles(folder) {
        let itens = this.organizerUtils.getContentFromPath(folder)
        itens.forEach(item => {
            let pathItemDestiny = `${folder}/${item}`
            if(this.organizerUtils.isDirectory(pathItemDestiny)) {
                this.loadDestinyFiles(pathItemDestiny)
            } else {
                this.destinyFiles.add(item)
                this.mapDestinyFiles[item] = pathItemDestiny
            }
        })
    }

    moveRecursive(folder) {
        let itens = this.organizerUtils.getContentFromPath(folder)
        itens.forEach(item => {
            let pathItemOrigin = `${folder}/${item}`

            if(this.organizerUtils.isDirectory(pathItemOrigin)) {
                this.moveRecursive(pathItemOrigin)
            } else {
                if (this.destinyFiles.has(item)) {
                    this.hasProblem = true
                    this.logger.logInfo(`\n Item ${pathItemOrigin} found \n`)
                    this.foundFolders.add(folder)
                    this.organizerUtils.renameFile(this.mapDestinyFiles[item], `E:/moved_files/${item}`)
                }
            }
        })
    }
}

new MoveCopy( 'F:/FOTOS_PRONTAS/Proibidas', 'E:/GoogleDrive/Fotos Proibidas').move()
//new MoveCopy( 'F:/test', 'F:/test2').move()