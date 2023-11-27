// Middleware to check if request is authenticated
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Dev ip
    //if(req.ip == '::1') {
    //    console.log('dev route');
    //    req.user = {
    //        name: 'dev',
    //        uuid: 'fG4ZHdiG'
    //    };
    //    //next();
    //}
    console.log('Auth');
    // Check if token exists
    if(token === undefined) res.status(401).json({error: "Unauthorized"});
    else {
        // Verify token
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, payload) => {
            if(err) res.status(403).json({error: "Forbidden"});
            else {
                req.user = payload.user;
                console.log('Auth success');
                next();
            }
        });
    }
    return;
}

// Export middleware
module.exports = auth;