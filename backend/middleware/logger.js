// Logger middleware
const logger = (req, res, next) => {
   console.log('Logger');
    next();
    console.log(`
    [${req.currtime}] ${req.method}: ${req.hostname}${req.url} requested from ${req.header('x-forwarded-for')}
    
    Request:
       L ${JSON.stringify(req.body)}

    Response:
       L [${JSON.stringify(res.statusCode)}] ${JSON.stringify(res.statusMessage)}
    `);
}

// Export middleware
module.exports = logger;