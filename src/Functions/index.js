(function () {
    "use strict";
    var functionsInterface = module.exports = {
        "Fallback": require('./exports/fallbackResponses'),
        "Sleep": require('./exports/sleep'),
        "WriteFileEXT": require('./exports/writeFileName').writeFileName,
        "Greetings": require('./exports/greetings'),
        "WriteFileMime": require('./exports/writeFileName').writeFileNameWithMime,
        "Cors": require('./exports/cors'),
        "Limiter": require('./exports/limiter'),
        "InitialMessage": require('./exports/initialMessage'),
        "Execute": require('./exports/execute'),
        "Flags": require('./exports/flags'),
        "UpgradeVENOM": require('./exports/updateVenom')
    };
}());

