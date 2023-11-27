// Middleware to check if request is authenticated
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Dev ip
    if(req.ip == '::1') {
        console.log('dev route');
        req.user = {
            name: 'dev',
            uuid: 'fG4ZHdiG'
        };
        next();
    }

    // Check if token exists
    if(token == null) return res.sendStatus(401).json({error: "Unauthorized"});

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
        if(err) res.sendStatus(403).json({error: "Forbidden"});
        else {
            req.user = payload.user;
            next();
        }
    });
    return;
}

// Export middleware
module.exports = auth;