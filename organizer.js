const fs = require('fs')

const pathOrigem = 'd:/test_organizer/origem'
const pathDestiny = 'd:/test_organizer/destiny'

fs.readdir(pathOrigem, (err, files) => {
    files.forEach(file => {
        let folder = file.substring(4, 12)

        if (fs.existsSync(`${pathDestiny}/${folder}`)) {
            console.log(`The folder ${folder} exists`);
        } else {
            console.log(`The folder ${folder} not exists`);
            fs.mkdir(`${pathDestiny}/${folder}`, { recursive: true }, (err) => {
                if (err) throw err;
            })
        }

        if (fs.existsSync(`${pathDestiny}/${folder}/${file}`)) {
            console.log(`The file ${file} already exists`)
        } else {
            console.log(`Coping the file ${file}`)
            fs.copyFileSync(`${pathOrigem}/${file}`, `${pathDestiny}/${folder}/${file}`)
        }
    })
})