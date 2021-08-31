const fs = require('fs')
const fancyTimeFormat = require('./fancyTimeFormat.js')

const pathOrigem = 'd:/GDriver/Fotos/2020'

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

                if(expectedFolder != folder) {
                    log = log.concat(`\n >>>>> The expected folder ${expectedFolder} to file ${file} but stay in ${folder}!!! \n\n`)
                    console.log(`\n >>>>> The expected folder ${expectedFolder} to file ${file} but stay in ${folder}!!! \n\n`)
                    stop = true
                } else {
                    log = log.concat(`Validation of the file ${file} from folder ${expectedFolder} is ok \n`)
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

console.log(`End process, time leapsed ${fancyTimeFormat(timeLapsed)}.`)