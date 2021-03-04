const RateLimit = require('express-rate-limit');

let limiter = new RateLimit({
    windowMs: 10 * 1000, // 10 seconds
    max: 25
});

module.exports = limiter;