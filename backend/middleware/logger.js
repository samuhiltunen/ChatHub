// Logger middleware
const logger = (req, res, next) => {
    next();

   let reqData;

   // Parse request data
   if(req.body) reqData = JSON.stringify(req.body);
   else if(req.query != {}) reqData = JSON.stringify(req.query);
   else reqData = "empty";

   // Ignore get messages
   if(req.method === "GET" && req.originalUrl.startsWith('/messages/')) return;

   // Log request
    console.log(`
    [${req.currtime}] ${req.method}: ${req.hostname}${req.originalUrl} requested from ${req.header('x-forwarded-for')}
    
    Request:
       L ${reqData}

    Response:
       L [${JSON.stringify(res.statusCode)}] ${JSON.stringify(res.statusMessage)}
    `);
}
// Export middleware
module.exports = logger;