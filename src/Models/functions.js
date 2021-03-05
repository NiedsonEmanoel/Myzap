(function () {
    "use strict";
    var functionsInterface = module.exports = {
        "Fallback": require('./Utils/fallbackResponses'),
        "Sleep": require('./Utils/sleep'),
        "WriteFileEXT": require('./Utils/writeFileName').writeFileName,
        "Greetings": require('./Utils/greetings'),
        "WriteFileMime": require('./Utils/writeFileName').writeFileNameWithMime
    };
}());