const exec = require("child_process");

module.exports = function execute(command) {
    let version = exec.execSync(command);
    return version.toString();
}