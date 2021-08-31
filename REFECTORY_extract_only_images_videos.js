const fs = require('fs')
const path = require('path')
const fancyTimeFormat = require('./fancyTimeFormat.js')
const moment = require('moment');

let Extractor = class {    

    extensions = new Set();

    log = ""

    constructor(pathOrigem, pathDestiny) {
        this.pathOrigem = pathOrigem
        this.pathDestiny = pathDestiny
    }

    extract() {
        console.log('Start the process. \n')
        const startTime = new Date()

        this.log = ""
  
        this.extractRecursive(this.pathOrigem)

        console.log(this.extensions)

        const endTime = new Date()
        const nameLog = `${endTime.getHours()}_${endTime.getMinutes()}_${endTime.getSeconds()}`

        fs.writeFile(`d:/log_checker_${nameLog}.txt`, this.log, 'UTF-8', (err) => {
            if (err) return console.log(err);
        })

        const timeLapsed = (endTime - startTime) / 1000

        console.log(`\n Log saved on d:/log_checker_${nameLog}.txt`);
        console.log(`\n End process, time leapsed ${fancyTimeFormat(timeLapsed)}.`)
    }

    extractRecursive(item) {
        this.log = this.log.concat(`Recursive the item ${item} \n`)
        if(!fs.lstatSync(item).isDirectory()) {
            let extension = path.extname(item).toLowerCase()

            if(isImage(extension) || isVideo(extension)) {

                this.log = this.log.concat(`Extesion file ${path.extname(item)} \n`)
                this.extensions.add(path.extname(item))

                this.transferFile(item)
            }
        } else {
            let subItemsOrigem = fs.readdirSync(item)
            subItemsOrigem.forEach(subItem => {
                return this.extractRecursive(`${item}/${subItem}`)
            })
        }
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

    transferFile(file) {
        if(fs.lstatSync(file).isFile()) {   
            let stats = fs.statSync(file);
            let folder = moment(new Date(stats.mtime)).format("YYYYMMDD");
            
            let folderDestiny = `${this.pathDestiny}/${folder}`

            this.createFolder(folderDestiny)
            this.copyFile(file, folderDestiny)
        }
    }

    copyFile(file, folderDestiny) {
        let fileDestiny = `${folderDestiny}/${path.basename(file)}`
        if (fs.existsSync(fileDestiny)) {
            this.log = this.log.concat(`=>The file ${file} already exists on ${fileDestiny} \n`)
        } else {
            this.log = this.log.concat(`Coping the file ${path.basename(file)} to ${folderDestiny} \n`)
            fs.copyFileSync(file, fileDestiny)
        }
    }

    createFolder(folder) {
        if (!fs.existsSync(folder)) {
            this.log = this.log.concat(`The folder ${folder} not exists, creating... \n`);
            fs.mkdir(folder, { recursive: true }, (err) => {
                if (err) throw err;
            })
        }
    }
}

new Extractor('D:/Leticia Pansardis/Backup Celular David/BKP Imagens/Camera', 'd:/extracted_images').extract()