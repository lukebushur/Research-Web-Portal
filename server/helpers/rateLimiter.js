const rateLimit = require('express-rate-limit');

/*  This middle ware uses express-rate-limit to make a simple rate limiter. 
    timeFrameInMinutes determiens the number of mintues for the rate limiting window, and limit is the number of requests allowed in that window
    If a user exceeds the limit, they will be unable to utilize any route that have the rate limiter attached to them
*/
const rateLimiter = (limit, timeFrameInMinutes) => {
    return rateLimit({
        max: limit,
        window: timeFrameInMinutes * 60 * 1000, //Convert Minutes to milliseconds
        message: {
            error: {
                status: 429,
                message: "CHILL_DAWG",
                expiry: timeFrameInMinutes * 2.5
            }
        }
    });
}

module.exports = rateLimiter;