const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
    widowMs: 60 * 1000,
    max: 10,
    message: 'Too many requests, please try again later.',
    legacyHeaders: false,
    statusCode: 429,
});

module.exports = rateLimiter;