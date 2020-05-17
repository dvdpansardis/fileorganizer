const fs = require('fs')
const fancyTimeFormat = require('./fancyTimeFormat.js')

const pathOrigem = 'd:/BKP_Celular'
const pathDestiny = 'd:/Pâmela'

const filesOrigem = fs.readdirSync(pathOrigem)

console.log('Start the process. \n')

const startTime = new Date()

let log = ""

filesOrigem.forEach(file => {

    let expectedFolder = file.substring(2, 10)

    log = log.concat(`Validating file ${file} in expectd folder ${expectedFolder} \n`)

    if(!fs.existsSync(`${pathDestiny}/${expectedFolder}`)) {
        log = log.concat(`The expected folder ${expectedFolder} to file ${file} not exists!!! \n`)
    } else {
        if(!fs.existsSync(`${pathDestiny}/${expectedFolder}/${file}`)) {
            log = log.concat(`The file ${file} not exists in folder ${expectedFolder}!!! \n`)
        } else {
            log = log.concat(`Validation of the file ${file} from folder ${expectedFolder} is ok \n`)
        } 
    }
    
})

const endTime = new Date()
let nameLog = `${endTime.getHours()}_${endTime.getMinutes()}_${endTime.getSeconds()}`

fs.writeFile(`d:/log_checker_${nameLog}.txt`, log, 'UTF-8', (err) => {
    if (err) return console.log(err);
})

const timeLapsed = (endTime - startTime) / 1000

console.log(`End process, time leapsed ${fancyTimeFormat(timeLapsed)}.`)