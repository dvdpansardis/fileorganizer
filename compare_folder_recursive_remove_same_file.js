import Logger from './utils/logger.js'
import OrganizerUtils from './utils/organizer_utils.js'

class CompareFolder {

    constructor(pathOriginToRemove, pathHasFiles) {
        this.pathOriginToRemove = pathOriginToRemove
        this.pathHasFiles = pathHasFiles
        this.destinyFiles = new Set()
        this.logger = new Logger()
        this.organizerUtils = new OrganizerUtils()
        this.foundFolders = new Set()
    }

    compare() {
        this.logger.startProcess()

        this.hasProblem = false
        
        this.loadDestinyFiles(this.pathHasFiles)

        this.compareRecursive(this.pathOriginToRemove)

        if(this.hasProblem) {
            console.log(`\n *** HAS PROBLEM, SEE THE LOG *** \n`)
        }

        if (this.foundFolders.size > 0) {
            console.log(`\n Folders found \n`)
            this.logger.logInfo(`\n Folders found \n`)
            this.foundFolders.forEach(f => {
                this.logger.logInfo(f)
                console.log(f)
            });
        }

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
            }
        })
    }

    compareRecursive(folder) {
        let itens = this.organizerUtils.getContentFromPath(folder)
        itens.forEach(item => {
            let pathItemOrigin = `${folder}/${item}`

            if(this.organizerUtils.isDirectory(pathItemOrigin)) {
                this.compareRecursive(pathItemOrigin)
            } else {
                if (this.destinyFiles.has(item)) {
                    this.hasProblem = true
                    this.logger.logInfo(`\n Item ${pathItemOrigin} found \n`)
                    this.organizerUtils.removeFile(pathItemOrigin)
                    this.foundFolders.add(folder)
                }
            }
        })
    }
}

new CompareFolder('D:/Distribuir', 'D:/teste/NotFound1').compare()