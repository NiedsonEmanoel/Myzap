const RateLimit = require('express-rate-limit');

let limiter = new RateLimit({
    windowMs: 4 * 1000, // 4 seconds
    max: 30,
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