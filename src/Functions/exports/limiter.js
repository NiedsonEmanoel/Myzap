const RateLimit = require('express-rate-limit');

let limiter = new RateLimit({
    windowMs: 5 * 1000, // 5 seconds
    max: 15
});

module.exports = limiter;