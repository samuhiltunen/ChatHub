// Import modules
const express = require('express');
const bcrypt = require('bcrypt');
const { default: ShortUniqueId } = require('short-unique-id');
const { middleware, database } = require('../loader');

// Database
const { dbConn } = database;

// Import middleware
const { auth } = middleware;

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
        if(!req.body.name || !req.body.password) {
            res.status(400).json({error: 'Bad request'});
            return;
        }

        // Start database connection
        dbConn().then(async ({ User }) => {

            // Check if user exists
            if(await User.exists({name: req.body.name})) {
                res.status(409).json({error: 'User already exists'});
                return;
            }

            const newUser = new User({
                uuid: new ShortUniqueId().randomUUID(8),
                name: req.body.name,
                pass: bcrypt.hashSync(req.body.password, 10),
                info: {
                    avatar: req.body.avatar??'default',
                    status: 'Hello there! I am new to ChatHub.',
                    bio: req.body.bio??'',
                    logged: false,
                    userCreated: Date.now(),
                    lastOnline: Date.now()
                }
            });

            // Save user to database
            newUser.save();

            // Response
            res.status(201).json({content: 'User created'});

        }).catch(err => {
            console.log(err);
            res.status(500).json({error: 'Internal server error'});
            return;
        });
    }
})
.get(auth, (req, res) => {
    // Find user in database
    dbConn().then(async ({ User }) => {
        new Promise((res) => {
            
            const search = {};

            // Make search object
            for(const [key, val] of Object.entries(req.query)) {
                
                // Check if key is regex
                if(RegExp('^/.*/$').test(val)) {
                    search[key] = RegExp(val.slice(1, -1));
                    continue;
                }
                search[key] = val;
            }
            res(User.find().byMult(search));
        })
        .then(result => {
        res.status(200).json({content: result});
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    });
});

module.exports = router;