const notifier = require('node-notifier')
const path = require('path')

class Notifier {
    constructor() {
        this.notifier = notifier
    }

    notify(message) {

        this.notifier.notify({
            title: 'My Zap',
            message: message,
            icon: path.resolve('./', 'Controllers', 'Classes', 'Temp', 'myzap.png'),
            timeout: 5,
            appID: 'Nm Soft'
        })
    }
}

module.exports = Notifier
