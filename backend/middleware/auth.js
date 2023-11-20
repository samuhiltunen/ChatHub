// Middleware to check if request is authenticated
const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    // Check if token exists
    if(token == null) return res.sendStatus(401).sendJSON({error: "Unauthorized"});

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Export middleware
module.exports = {auth};