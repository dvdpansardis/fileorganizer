import OrganizerUtils from './utils/organizer_utils.js';
import Logger from './utils/logger.js'
    
class Organizer {

    constructor(pathOrigin, pathDestiny) {
        this.pathOrigin = pathOrigin
        this.pathDestiny = pathDestiny
        this.destinyFiles = new Set()
        this.destinyFolders = new Set()
        this.logger = new Logger()
        this.organizeUtils = new OrganizerUtils()
    }

    organize() {
        this.logger.startProcess()

        this.extractRecursive(this.pathOrigin)

        this.logger.endProcess()
    }

    extractRecursive(folder) {
        let itens = this.organizeUtils.getContentFromPath(folder)

        itens.forEach(item => {
            let pathItemOrigin = `${folder}/${item}`

            if (this.organizeUtils.isDirectory(pathItemOrigin)) {
                this.extractRecursive(pathItemOrigin)
            } else {
                if (!this.organizeUtils.isSystemFile(pathItemOrigin)) {
                    let folder = this.extractFolder(pathItemOrigin)
                  
                    this.createFolderOnDestiny(folder.parentYearFolder)
                    this.createFolderOnDestiny(folder.path)
            
                    if (this.existsFileOnDestiny(folder.path, item)) {
                        this.logger.logInfo(`The file ${item} already exists \n`)
        
                        if (this.existsFolderOnDestiny(this.organizeUtils.generateCopyFolderName(folder.path))) {
                            this.logger.logInfo(`The folder ${this.organizeUtils.generateCopyFolderName(folder.path)} exists \n`)
                        } else {
                            this.createFolderOnDestiny(this.organizeUtils.generateCopyFolderName(folder.path))
                        }

                        this.copyFileToCopyDestiny(pathItemOrigin, folder.path, item)
                    } else {
                        this.copyFileToDestiny(pathItemOrigin, folder.path, item)
                    }
                }
            }
        })
    }

    extractFolder(file) {
        let folder = this.extractFolderNameFromFile(file)
        return {
            parentYearFolder: folder.substring(0, 4), 
            childrenDateFolder: folder,
            path: `${folder.substring(0, 4)}/${folder}`
        }
    }

    extractFolderNameFromFile(file) {
        let dateFile = this.organizeUtils.forceRetrieveDateFromName(file) 
        if (dateFile == undefined || dateFile == null) {
            dateFile = this.organizeUtils.extractFolderNameByMetadata(file) 
            if (dateFile == undefined || dateFile == null) {
                return '00000000'
            }
        }
        return dateFile
    }

    createFolderOnDestiny(folder) {
        let folderOnDestiny = `${this.pathDestiny}/${folder}`
        if (this.existsFolderOnDestiny(folderOnDestiny)) {
            this.logger.logInfo(`The folder ${folderOnDestiny} exists \n`)
        } else {
            this.logger.logInfo(`The folder ${folderOnDestiny} not exists, creating... \n`)
            this.organizeUtils.createFolder(folderOnDestiny)
            this.destinyFolders.add(folderOnDestiny)
        }
    }

    copyFileToDestiny(fileOrigin, subFolder, file) {
        this.logger.logInfo(`Coping the file ${fileOrigin} to ${this.pathDestiny}/${subFolder} \n`)
        this.organizeUtils.copyFile(fileOrigin, `${this.pathDestiny}/${subFolder}/${file}`)
        this.destinyFiles.add(`${this.pathDestiny}/${subFolder}/${file}`)
    }

    copyFileToCopyDestiny(fileOrigin, subFolder, file) {
        let subFolderCopy = this.organizeUtils.generateCopyFolderName(subFolder)
        this.logger.logInfo(`Coping the file ${fileOrigin} to ${this.pathDestiny}/${subFolderCopy} \n`)
        this.organizeUtils.copyFile(fileOrigin, `${this.pathDestiny}/${subFolderCopy}/${this.organizeUtils.generateCopyFileName(file)}`)
    }

    existsFileOnDestiny(subFolder, file) {
        return this.destinyFiles.has(`${this.pathDestiny}/${subFolder}/${file}`)
    }

    existsFolderOnDestiny(folder) {
        return this.destinyFolders.has(folder)
    }

    // DEPRECATED
    /*
    existsFileOnDestiny(subFolder, file) {
        return this.organizeUtils.existsFile(`${this.pathDestiny}/${subFolder}/${file}`)
    }

    existsFolderOnDestiny(folder) {
        return this.organizeUtils.existsFolder(`${this.pathDestiny}/${folder}`)
    }
    */
}

new Organizer('F:/DistribuirSeparadosPorExt/JPG', 'F:/DistribuirOrganizado').organize()
// new Organizer('E:/FOTOS/LehBkpNoteDvdSeparadosOrganizados', 'D:/LehBkpNoteDvdSeparadosOrganizados2').organize()
//new Organizer('D:/test', 'D:/test2').organize()



