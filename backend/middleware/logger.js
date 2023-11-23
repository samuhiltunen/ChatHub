// Logger middleware
const logger = (req, res, next) => {
    console.log(`
    [${req.currtime}] ${req.method}: ${req.hostname}${req.url} requested from ${req.header('x-forwarded-for')}. 
    
    Request:
       L ${JSON.stringify(req.body)}
    `);
    next();
}

// Export middleware
module.exports = logger;