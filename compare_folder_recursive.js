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

        console.log(`\n Folders not found \n`)
        this.logger.logInfo(`\n Folders not found \n`)
        this.notFoundFolders.forEach(f => {
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

    // Deprecated
    compareRecursiveInHd(folder) {
        let itens = this.organizerUtils.getContentFromPath(folder)
        itens.forEach(item => {
            let pathItemOrigin = `${folder}/${item}`

            if(this.organizerUtils.isDirectory(pathItemOrigin)) {
                this.compareRecursive(pathItemOrigin)
            } else {
                if (!this.existsFileDestinyFolder(item, this.pathDestiny)) {
                    this.hasProblem = true
                    this.logger.logInfo(`\n Item ${pathItemOrigin} not found \n`)
                    this.notFoundFolders.add(folder)
                }
            }
        })
    }

    // Deprecated
    existsFileDestinyFolder(file, folder) {
        let exists = false
        let itens = this.organizerUtils.getContentFromPath(folder)
        itens.forEach(item => {
            if (exists) return
            let pathItemDestiny = `${folder}/${item}`
            if(this.organizerUtils.isDirectory(pathItemDestiny)) {
                exists = this.existsFileDestinyFolder(file, pathItemDestiny)
                if (exists) return
            } else if (file == item) {
                exists = true
                //this.logger.logInfo(`\n Item ${pathItemDestiny} found \n`)
                return
            }
        })
        return exists
    }

    

}

new CompareFolder( 'E:/GoogleDrive/Fotos_old', 'E:/GoogleDrive/Fotos').compare()