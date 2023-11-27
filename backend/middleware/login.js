const bcrypt = require('bcrypt');
const { database } = require('../loader');
const { dbConn } = database;

// Validate user login
async function login(req, res, next) {
    // Validate request
    if(!req.body.name || !req.body.password) {
        res.status(400).json({error: 'Bad request'});
        return;
    }

    // Check if user exists in database
    dbConn()
    .then(({ User }) => {
        return new Promise((resolve)=>{
            resolve(User.findOne({name: req.body.name}));
        });
    })
    .then(async (user) => {

        // Compare passwords
        if(!await bcrypt.compare(req.body.password, user.pass)) {
            res.status(403).json({error: 'Invalid password'});
            return;
        }

        // Change user logged in status and last online
        user.info.logged = true;
        await user.save();
        
        // Add user to request
        req.user = user;
        next();

    }).catch(err => {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
        return;
    });
}

// Export middleware
module.exports = login;