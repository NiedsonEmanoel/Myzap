const RateLimit = require('express-rate-limit');

let limiter = new RateLimit({
    windowMs: 2 * 1000, // 8 seconds
    max: 100
});

module.exports = limiter;