const fs = require('fs')
const fancyTimeFormat = require('./fancyTimeFormat.js.js')

const pathOrigem = 'd:/gdriver/pâmela'
const pathDestiny = 'F:/Pâmela'

const foldersOrigem = fs.readdirSync(pathOrigem)

console.log('Start the process. \n')

const startTime = new Date()

let log = ""
let stop = false

foldersOrigem.forEach(folder => {

    if(folder != 'desktop.ini' && folder != 'Ultrasons') {
        const filesOrigem = fs.readdirSync(`${pathOrigem}/${folder}`)
        
        filesOrigem.forEach(file => {
            if(!stop && file != 'desktop.ini') {
                let expectedFolder = file.substring(2, 10)

                log = log.concat(`Validating file ${file} in expectd folder ${expectedFolder} \n`)

                if(!fs.existsSync(`${pathDestiny}/${expectedFolder}`)) {
                    log = log.concat(`\n >>>>> The expected folder ${expectedFolder} to file ${file} not exists!!! \n\n`)
                    stop = true
                } else {
                    if(!fs.existsSync(`${pathDestiny}/${expectedFolder}/${file}`)) {
                        log = log.concat(`\n >>>> The file ${file} not exists in folder ${expectedFolder}!!! \n\n`)
                        stop = true
                    } else {
                        log = log.concat(`Validation of the file ${file} from folder ${expectedFolder} is ok \n`)
                    } 
                }
            }
        })
    }
})

const endTime = new Date()
let nameLog = `${endTime.getHours()}_${endTime.getMinutes()}_${endTime.getSeconds()}`

fs.writeFile(`d:/log_checker_${nameLog}.txt`, log, 'UTF-8', (err) => {
    if (err) return console.log(err);
})

const timeLapsed = (endTime - startTime) / 1000

console.log(`Log saved on d:/log_checker_${nameLog}.txt`);

console.log(`End process, time leapsed ${fancyTimeFormat(timeLapsed)}.`)