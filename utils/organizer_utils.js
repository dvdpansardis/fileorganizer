import { unlinkSync, readdirSync, existsSync, lstatSync, statSync, mkdirSync, copyFileSync, readFileSync, rename } from 'fs'
import moment from 'moment'
import { basename, extname } from 'path'
import exif from 'exif-parser'

export default class OrganizerUtils {

    constructor() {} 

    isFile(file) {
        return lstatSync(file).isFile()
    }

    extractFolderNameByFileName(file) {
        return basename(file).match(/\d/g).join('').substring(0 , 8)
    }

    isValidDateFromFileName(dateFromFile) {
        return dateFromFile == null || dateFromFile == undefined || dateFromFile == 'Invalid date'
    }

    extractFolderNameByMetadata(file) {
        let dateFromFile = this.extractFolderDateByStat(file) 
        if (this.isValidDateFromFileName(dateFromFile)) {
            dateFromFile = this.forceExtractDateFromExif(file)
        }
        return dateFromFile
    }

    extractFolderDateByStat(file) {
        let stats = statSync(file);
        var times = [
            new Date(stats.atime).getTime(),
            new Date(stats.mtime).getTime(),
            new Date(stats.ctime).getTime(),
            new Date(stats.birthtime).getTime()
        ]
        times.sort();
        return moment(times.shift()).format('YYYYMMDD')
    }

    forceExtractDateFromExif(file) {
        try {
            let buffer = readFileSync(file)
            let parser = exif.create(buffer)
            let result = parser.parse()
    
            let dateFromFile = this.extractDateFromExifByTags(result.tags, 'DateTimeOriginal')
            if (this.isValidDateFromFileName(dateFromFile)) {
                dateFromFile = this.extractDateFromExifByTags(result.tags, 'CreateDate')
            }
            return dateFromFile
        } catch (e) {
            return undefined
        }
    }

    extractDateFromExifByTags(tags, key) {
        let dateFromFile = undefined
        if (tags[key] != undefined 
            && tags[key] != '    :  :     :  :  ') {
            
            dateFromFile = moment(this.msToDate(tags[key])).format('YYYYMMDD')
            if (this.isValidDateFromFileName(dateFromFile)) {
                dateFromFile = moment(this.convertToDate(tags[key])).format('YYYYMMDD')
            }
        } 
        return dateFromFile
    }

    msToDate(ms) {
        if (new String(ms).trim.length <= 10) {
            return new Date(ms * 1000)
        }
        return new Date(ms)
    }

    convertToDate(strDate) {
        let str = strDate.match(/\d/g).join('').substring(0 , 8)
        return Date.UTC(str.substring(0, 4), str.substring(4, 6) - 1, str.substring(6, 8), 12, 0, 0)
    }

    isDirectory(item) {
        return lstatSync(item).isDirectory() 
    }
 
    isIniFile(file) {
        return file == 'desktop.ini'
    }

    existsAnythingOnPath(path) {
        return existsSync(path)
    }

    getContentFromPath(path) {
        return readdirSync(path)
    }

    extractFolderByFolderName(file) {
      let folder = this.extractFolderNameByFileName(file)
      return {
          parentFolder: folder.substring(0, 4), 
          childrenfolder: folder,
          path: `${folder.substring(0, 4)}/${folder}`
      }
    }

    isSystemFile(file) {
        let baseName = basename(file)
        return baseName == 'desktop.ini' || baseName == 'Thumbs.db' || baseName == 'photothumb.db'
    }

    getExtension(file) {
        return extname(file)
    }

    forceRetrieveDateFromName(file) {
        let baseFileName = basename(file)
        if (this.isPictureNamePatternA(baseFileName) 
            || this.isPictureNamePatternB(baseFileName) 
            || this.isPictureNamePatternC(baseFileName)
            || this.isPictureNamePatternD(baseFileName)
            || this.isPictureNamePatternE(baseFileName)) {
            return this.extractFolderNameByFileName(baseFileName)
        }
        if (this.isPictureNamePatternF(baseFileName)) {
            return '20'.concat(baseFileName.substring(6, 8)).concat(baseFileName.substring(3 , 5)).concat(baseFileName.substring(0 , 2))
        }
        return undefined
    }

    isPictureNamePatternA(file) {
        return file.startsWith('P_') && file.length >= 13
    }

    isPictureNamePatternB(file) {
        return file.startsWith('V_') && file.length >= 13
    }

    isPictureNamePatternC(file) {
        return file.startsWith('IMG_') && file[12] == '-'
    }

    isPictureNamePatternD(file) {
        return file.startsWith('IMG-') && file[12] == '-'
    }

    isPictureNamePatternE(file) {
        return file[4] == '-' && file[7] == '-' && file.length >= 14
    }

    isPictureNamePatternF(file) {
        return file[2] == '-' && file[5] == '-' && file.length >= 11
    }

    generateCopyFileName(file) {
        let extension = extname(file);
        let fileName = basename(file, extension);
        return fileName.concat("__").concat(Math.floor(Math.random() * 10000)).concat(extension)
    }

    generateCopyFolderName(folder) {
        return folder.concat("_COPY")
    }

    createFolder(folder) {
        mkdirSync(folder, { recursive: true }, (err) => {
            if (err) throw err
        })  
    }

    copyFile(origin, destiny) {
        copyFileSync(origin, destiny)
    }

    existsFile(file) {
        return existsSync(file)
    }

    existsFolder(folder) {
        return existsSync(folder)
    }

    isBlackList(file) {
        return file.startsWith('image-') && file.lenght > 50
    }

    renameFile(oldPath, newPath) {
        rename(oldPath, newPath, function (err) {
            if (err) throw err
        })
    }

    removeFile(file) {
        unlinkSync(file);
    }
}
