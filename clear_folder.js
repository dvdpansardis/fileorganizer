const fs = require('fs')
const path = require('path')
const fancyTimeFormat = require('./fancyTimeFormat.js')
const moment = require('moment');

let ClearFolder = class {    

    log = ""

    constructor(pathOrigem, pathDestiny) {
        this.pathOrigem = pathOrigem
        this.pathDestiny = pathDestiny
    }

    clear() {
        this.startProcess()
        let subFolderOrigens = fs.readdirSync(this.pathOrigem)
        subFolderOrigens.forEach(subFolder => {
            let pathSubFolder = `${this.pathOrigem}/${subFolder}`
            let itens = fs.readdirSync(pathSubFolder)

            itens.forEach(item => {
                let pathItem = `${this.pathOrigem}/${subFolder}/${item}`
                let extension = path.extname(pathItem).toLowerCase()

                if((this.isImage(extension) || this.isVideo(extension)) && this.retriveSizeFileKB(pathItem) < 100) {
                    let pathDestinyItem =  `${this.pathDestiny}/${item}`
                    if(!fs.existsSync(pathDestinyItem)) {
                        fs.copyFileSync(pathItem, pathDestinyItem)
                    }
                    fs.unlinkSync(pathItem)
                    this.log = this.log.concat(`Past the file ${pathItem} to ${pathDestinyItem} \n`)
                }
            })

            if(this.isDirEmpty(pathSubFolder)) {
                fs.rmdirSync(pathSubFolder);
            }
        })
        this.endProcess()
    }

    startProcess() {
        console.log('Start the process. \n')
        this.startTime = new Date()

        this.log = ""
    }

    endProcess() {
        const endTime = new Date()
        const nameLog = `${endTime.getHours()}_${endTime.getMinutes()}_${endTime.getSeconds()}`

        fs.writeFile(`d:/log_checker_${nameLog}.txt`, this.log, 'UTF-8', (err) => {
            if (err) return console.log(err);
        })

        const timeLapsed = (endTime - this.startTime) / 1000

        console.log(`\n Log saved on d:/log_checker_${nameLog}.txt`);
        console.log(`\n End process, time leapsed ${fancyTimeFormat(timeLapsed)}.`)
    }

    isDirEmpty(dirname) {
        let files = fs.readdirSync(dirname)
        return files.length == 0;
    }
/*
    moveFile(file, folderDestiny) {
        let fileDestiny = `${folderDestiny}/${path.basename(file)}`
        if (fs.existsSync(fileDestiny)) {
            this.log = this.log.concat(`=>The file ${file} already exists on ${fileDestiny} \n`)
        } else {
            fs.rename(file, fileDestiny, function (err) {
                if (err) throw err
            })
            this.log = this.log.concat(`Past the file ${path.basename(file)} to ${folderDestiny} \n`)
        }
    }
*/
    retriveSizeFileKB(file) {
        var stats = fs.statSync(file)
        var fileSizeInBytes = stats.size;
        return fileSizeInBytes / (1024);
    }

    isImage(extension) {
        return extension == '.jpg'
            || extension == '.jpeg'
            || extension == '.jpgg'
            || extension == '.jpgs'
            || extension == '.png'
    }

    isVideo(extension) {
        return extension == '.mov'
        || extension == '.mpg'
        || extension == '.mpeg'
        || extension == '.mp4'
        || extension == '.wmv'
        || extension == '.avi'
    }

}

new ClearFolder('d:/extracted_images', 'd:/internet_images').clear()