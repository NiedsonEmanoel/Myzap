const RateLimit = require('express-rate-limit');

let limiter = new RateLimit({
    windowMs: 5 * 1000, // 8 seconds
    max: 50
});

module.exports = limiter;