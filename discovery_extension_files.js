import OrganizerUtils from './utils/organizer_utils.js'

class DiscoveryFiles {

    extensions = new Set()
    organizerUtils = new OrganizerUtils()

    discoveryFiles(folder) {
        this.discoveryRecursive(folder)
        console.log(this.extensions)
    }

    discoveryRecursive(folder) {
        let itens = this.organizerUtils.getContentFromPath(folder)
        itens.forEach(item => {
            if(this.organizerUtils.isDirectory(`${folder}/${item}`)) {
                this.discoveryRecursive(`${folder}/${item}`)
            }
            this.extensions.add(this.organizerUtils.getExtension(`${folder}/${item}`))
        })
    }

}

new DiscoveryFiles().discoveryFiles('D:/Leticia Pansardis')