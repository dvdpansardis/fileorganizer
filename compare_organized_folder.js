import Logger from './utils/logger.js'
import OrganizerUtils from './utils/organizer_utils.js'

class CompareFolder {

    constructor(pathOrigin, pathDestiny, useFileName, useYearFolder) {
        this.pathOrigin = pathOrigin
        this.pathDestiny = pathDestiny
        this.useFileName = useFileName
        this.useYearFolder = useYearFolder
        this.logger = new Logger()
        this.organizerUtils = new OrganizerUtils()
    }

    compare() {
        this.logger.startProcess()

        this.hasProblem = false
        
        this.compareRecursive(this.pathOrigin)

        if(this.hasProblem) {
            console.log(`\n *** HAS PROBLEM, SEE THE LOG *** \n`)
        }

        this.logger.endProcess()
    }

    compareRecursive(folder) {
        let itens = this.organizerUtils.getContentFromPath(folder)
        itens.forEach(item => {
            if(this.organizerUtils.isDirectory(`${folder}/${item}`)) {
                this.compareRecursive(`${folder}/${item}`)
            } else {
                let pathDestinyItem = this.useYearFolder ? `${folder}/${item}` : `${this.pathDestiny}/${item}`

                if(this.useYearFolder && this.organizerUtils.isDirectory(pathDestinyItem)) {
                    this.compareRecursive(pathDestinyItem)
                } 
    
                if(!this.organizerUtils.isSystemFile(pathDestinyItem)) {
                    this.existsFileInExpectedFolder(folder, item)
                }
            }
        })
    }

    existsFileInExpectedFolder(pathBaseOrigin, file) {
        let folder = this.extractFolderName(`${pathBaseOrigin}/${file}`)

        if(this.organizerUtils.existsAnythingOnPath(this.getPathOrigin(folder.path))) {
            if(this.organizerUtils.existsAnythingOnPath(this.getPathDestiny(`${folder.path}/${file}`))) {
                this.logger.logInfo(`Validation of the FILE ${this.pathOrigin}/${file} to expected folder ${folder.path} is ok \n`)
                return true
            } else {
                this.logger.logInfo(`\n *** [FAIL] *** The FILE ${this.pathOrigin}/${file} not exists in folder ${folder.path}!!! \n\n`)
                this.hasProblem = true
                return false
            } 
        } else {
            this.logger.logInfo(`\n *** [FAIL] *** The expected FOLDER ${folder.path} to file ${this.pathOrigin}/${file} not exists!!! \n\n`)
            this.hasProblem = true
            return false 
        }
    }

    extractFolderName(file) {
        let folder = this.useFileName ? this.organizerUtils.extractFolderNameByFileName(file) : this.organizerUtils.extractFolderNameByMetadata(file)
        return {
            parentFolder: folder.substring(0, 4), 
            childrenfolder: folder,
            path: this.useYearFolder ? `${folder.substring(0, 4)}/${folder}` : folder
        }
    }

    getPathOrigin(path) {
        return `${this.pathDestiny}/${path}`
    }

    getPathDestiny(path) {
        return `${this.pathDestiny}/${path}`
    }

}

new CompareFolder('D:/extracted_images', 'D:/UNIAO_FINAL', false, false).compare()