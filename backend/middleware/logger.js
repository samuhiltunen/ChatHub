// Logger middleware
const logger = (req, res, next) => {
    next();
    console.log(`
    [${req.currtime}] ${req.method}: ${req.hostname}${req.url} requested from ${req.header('x-forwarded-for')}
    
    Request:
       L ${JSON.stringify(req.body??req.query??"empty")}

    Response:
       L [${JSON.stringify(res.statusCode)}] ${JSON.stringify(res.statusMessage)}
    `);
}
// Export middleware
module.exports = logger;