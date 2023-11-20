// Logger middleware
const logger = (req, res, next) => {
    console.log(`
        [${req.currtime()}] ${req.method} ${req.url} requested from ${req.ip}. 
        \n Response sent with status ${res.statusCode}
    `);
    next();
}

// Export middleware
module.exports = { logger };