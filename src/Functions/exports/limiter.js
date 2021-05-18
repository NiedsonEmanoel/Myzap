const RateLimit = require('express-rate-limit');

let limiter = new RateLimit({
    windowMs: 2 * 1000, // 4 seconds
    max: 35,
    message: `
    <html style="height: 100%;">

    <head>
        <title>Vamos mais devagar?</title>
    </head>
    
    <body>
        <span>Muitas requisições, tente novamente mais tarde.</span>
    </body>

    </html>
    `,
});

module.exports = limiter;