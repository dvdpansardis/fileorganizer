import Logger from './utils/logger.js'
import OrganizerUtils from './utils/organizer_utils.js'

class CompareFolder {

    constructor(pathOrigin, pathDestiny) {
        this.pathOrigin = pathOrigin
        this.pathDestiny = pathDestiny
        this.destinyFiles = new Set()
        this.logger = new Logger()
        this.organizerUtils = new OrganizerUtils()
        this.notFoundFolders = new Set()
    }

    compare() {
        this.logger.startProcess()

        this.hasProblem = false
        
        this.loadDestinyFiles(this.pathDestiny)

        this.compareRecursive(this.pathOrigin)

        if(this.hasProblem) {
            console.log(`\n *** HAS PROBLEM, SEE THE LOG *** \n`)
        }

        if (this.notFoundFolders.size > 0) {
            console.log(`\n Folders not found \n`)
            this.logger.logInfo(`\n Folders not found \n`)
            this.notFoundFolders.forEach(f => {
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
                if (!this.destinyFiles.has(item)) {
                    this.hasProblem = true
                    this.logger.logInfo(`\n Item ${pathItemOrigin} not found \n`)
                    this.notFoundFolders.add(folder)
                }
            }
        })
    }   
}

new CompareFolder('D:/Downloads/danielacunhafotografia-19ac35.zip', 'E:/GoogleDrive').compare()