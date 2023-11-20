// Logger middleware
const logger = (req, res, next) => {
    next();
    console.log(`
        [${req.currtime()}] ${req.method} ${req.url} requested from ${req.ip}. 
        \n Response sent with status ${res.statusCode}
    `);
}

// Export middleware
module.exports = { logger };