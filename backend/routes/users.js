// Desc: User routes

// Import modules
const express = require('express');
const bcrypt = require('bcrypt');

// Import middleware
const { auth } = require('../middleware/auth');

// Import db controller
const { DbController } = require("../dbController");
const db = new DbController(process.env.MONGO_URI, process.env.MONGO_DB);

// Router
const router = express.Router();

router.route('/:job')
.post(async (req, res) => {
    if(req.params.job === 'login') {
        
        // Legacy code
        res.status(301).json({
            error: 'Moved permanently',
            msg: 'Moved to authServer'
        })
 
    } else if(req.params.job === 'register') {
        // Do register
        try {
            
            // Check if request is valid
            if(req.body.name === undefined || req.body.password === undefined) {
                res.status(400).json({error: 'Bad request'});
                return;
            }
            
            // Check if user exists in database
            if(await db.find("users", {name: req.body.name}, {}, true) !== null) {
                res.status(403).json({error: 'User already exists'})
                return;
            }

            // Hash password
            const passHash = await bcrypt.hash(req.body.password, 10);
            
            // Add user to database
            const user = {
                name: req.body.name,
                pass: passHash,
                info: {
                    avatar: req.body.avatar,
                    bio: req.body.bio,
                    userCreated: new Date(),
                    lastOnline: null
                }
            };

            const result = await db.insert("users", [user]);
            res.status(201).json({result: result});
            return;

        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Internal server error'});
        }
    }
})
.get(auth, async (req, res) => {

    // Validate request
    if(req.body.query === undefined) {
        res.status(400).json({error: 'Bad request', msg: 'Query is undefined'});
        return;
    }

    let options = {
        sort: req.body.sort ?? {},
        projection: req.body.proj ?? {},
    };

    // Remove unwanted properties from options to avoid db errors
    for(const [key, val] of Object.entries(options.projection)) {
        if(!val) delete options.projection[key];
        if(key=='pass') delete options.projection[key]; // Remove password from projection
    }

    // Find user in database
    db.find("users", req.body.query, options, false)
    .then(docs => {
        res.status(200).json({result: docs});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    });
});

module.exports = router;