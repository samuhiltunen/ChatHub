// Desc: User routes

// Import modules
const express = require('express');
const bcrypt = require('bcrypt');
const { default: ShortUniqueId } = require('short-unique-id');
const { middleware, database } = require('../loader');

// Database
const { dbConn } = database;

// Import middleware
const { auth } = middleware;

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
            content: 'Moved to authServer'
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
            dbConn().then(async ({ User }) => {
                const newUser = new User({
                    uuid: new ShortUniqueId().randomUUID(8),
                    name: req.body.name,
                    pass: passHash,
                    info: {
                        avatar: req.body.avatar,
                        status: '',
                        bio: req.body.bio,
                        logged: false,
                        userCreated: new Date(),
                        lastOnline: null
                    }
                });
                
                await newUser.save();
                res.status(201).json({success: 'User created'});
            })
            return;

        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Internal server error'});
            return;
        }
    }
})
.get(auth, async (req, res) => {

    // Find user in database
    dbConn().then(async ({ User }) => {
        const result = await User.find();
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    });
    return;
});

module.exports = router;