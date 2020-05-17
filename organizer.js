const fs = require('fs')
const fancyTimeFormat = require('fancyTimeFormat')

const pathOrigem = 'd:/BKP_Celular'
const pathDestiny = 'd:/Pâmela'

fs.readdir(pathOrigem, (err, files) => {
    if (files != null && files.length > 0) {
        let log = ""

        const startTime = new Date()

        console.log('Start the process. \n')

        files.forEach(file => {
            let folder = file.substring(2, 10)
    
            if (fs.existsSync(`${pathDestiny}/${folder}`)) {
                log = log.concat(`The folder ${folder} exists \n`);
            } else {
                log = log.concat(`The folder ${folder} not exists \n`);
                fs.mkdir(`${pathDestiny}/${folder}`, { recursive: true }, (err) => {
                    if (err) throw err;
                })
            }
    
            if (fs.existsSync(`${pathDestiny}/${folder}/${file}`)) {
                log = log.concat(`The file ${file} already exists \n`)
            } else {
                log = log.concat(`Coping the file ${file} \n`)
                fs.copyFileSync(`${pathOrigem}/${file}`, `${pathDestiny}/${folder}/${file}`)
            }
        })

        const endTime = new Date()
        const timeLapsed = (endTime - startTime) / 1000

        console.log(`End process, time leapsed ${fancyTimeFormat(timeLapsed)}.`)
    }
})


