import TimeUtils from './time_utils.js'
import { writeFile } from 'fs';

export default class Logger {

    constructor() {
        this.timeUtils = new TimeUtils()
    } 

    startProcess() {
        console.log('\n Start the process. \n')
        this.startTime = new Date()
        this.log = ""
    }

    endProcess() {
        const endTime = new Date()
        const nameLog = `${endTime.getHours()}_${endTime.getMinutes()}_${endTime.getSeconds()}`

        writeFile(`d:/log_checker_${nameLog}.txt`, this.log, 'UTF-8', (err) => {
            if (err) return console.log(err);
        })

        const timeLapsed = (endTime - this.startTime) / 1000

        console.log(`\n Log saved on d:/log_checker_${nameLog}.txt`);
        console.log(`\n Process finished, time leapsed ${this.timeUtils.fancyTimeFormat(timeLapsed)}.`)
    }

    logInfo(message) {
        this.log = this.log.concat(message);
    }

}
