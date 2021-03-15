(function () {
    "use strict";
    var functionsInterface = module.exports = {
        "Fallback": require('./exports/fallbackResponses'),
        "Sleep": require('./exports/sleep'),
        "WriteFileEXT": require('./exports/writeFileName').writeFileName,
        "Greetings": require('./exports/greetings'),
        "GenerateList": require('./exports/generateList'),
        "WriteFileMime": require('./exports/writeFileName').writeFileNameWithMime,
        "Cors": require('./exports/cors'),
        "Limiter": require('./exports/limiter'),
        "InitialMessage": require('./exports/initialMessage'),
        "Execute": require('./exports/execute'),
        "UpgradeVENOM": require('./exports/updateVenom')
    };
}());