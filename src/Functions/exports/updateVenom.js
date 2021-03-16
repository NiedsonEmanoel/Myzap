const execute = require('./execute');

module.exports = function update_last_version() {
    let local_version = parseInt(execute("npm list -l --depth=0 | awk -F@ '/venom-bot/ { print $2}'").split('\n')[0].split('.').join(''));
    let remote_version = parseInt(execute("npm show venom-bot version").split('\n')[0].split('.').join(''));
    if (local_version < remote_version) {
        console.log('Deprecated Version.');
        console.log('Upgrading to ' + execute("npm show venom-bot version").split('\n')[0] + '.');
        execute("npm install venom-bot@" + remote_version);
        execute("npm fund");
    } else {
        console.log(' - Version [PASSED]');
    }
}