const bcrypt = require('bcrypt');
const { DbController } = require('../dbController');
const db = new DbController(process.env.MONGO_URI, process.env.MONGO_DB);

// Validate user login
async function login(req, res, next) {
    // Validate request
    if(!req.body.name || !req.body.password) {
        res.status(400).json({error: 'Bad request'});
        return;
    }

    // Check if user exists in database
    const user = await db.find("users", {name: req.body.name}, {}, true);
    if(user === null) {
        res.status(403).json({error: 'User does not exist'});
        return;
    }

    // Compare passwords
    if(! await bcrypt.compare(req.body.password, user.pass)) {
        res.status(403).json({error: 'Wrong password'});
        return;
    }

    // Add user to request
    req.user = user;
    next();
}

// Export middleware
module.exports = { login };