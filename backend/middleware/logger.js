// Logger middleware
const logger = (req, res, next) => {
    next();
    console.log(`
    [${req.currtime}] ${req.method}: ${req.hostname}${req.url} requested from ${req.header('x-forwarded-for')}
    
    Request:
       L ${JSON.stringify(req.body)}

    Response:
       L ${JSON.stringify(res.body)}
    `);
}

// Export middleware
module.exports = logger;