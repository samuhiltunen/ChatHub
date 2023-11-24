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
        return next();
    }

    // Check if token exists
    if(token == null) return res.sendStatus(401).json({error: "Unauthorized"});

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
        if(err) return res.sendStatus(403).json({error: "Forbidden"});
        else {
            console.log(payload);
            req.user = payload.user;
            return next();
        }
    });
}

// Export middleware
module.exports = auth;