// Get currtime and add it to the request object

// Get current time
const currtime = () => {
    const date = new Date();
    const time = date.toTimeString().split(' ')[0];
    return time;
}

// Add currtime to request object
const timestamp = (req, res, next) => {
    req.currtime = currtime();
    next();
}

// Export middleware
module.exports = { timestamp };