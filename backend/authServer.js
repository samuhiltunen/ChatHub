const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(cors());

// Import modules
const { middleware, database } = require('./loader');

// Import database
const { dbConn } = database;

// Import middleware
const { timestamp, logger, validateJSON, motd, auth, login } = middleware;

app.use(express.json());
app.use(timestamp);
app.use(validateJSON);
app.use(motd);
app.use(logger);

// Login route for client to authenticate
app.post('/login', login, async (req, res) => {
    // User authenticated in middleware
    try {
         
        // Check if user is already logged in
        // This is legacy code - potential security issue
        /*
        if(req.user.info.logged) {
            res.status(403).json({error: 'User already logged in'});
            return;
        }
        */

        // Payload for tokens
        const payload = {
            flags: "login",
            user: req.user
        };

        // Create tokens
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN);

        // Add refresh token to database
        // MongoDB will automatically remove tokens after 24 hours
        dbConn().then(async ({ Token }) => {
            const newToken = new Token({
                token: refreshToken,
                createdAt: new Date()
            });
            await newToken.save();
        });

        // Update user logged in status
        dbConn().then(async ({ User }) => {
            const user = await User.findOne({name: req.user.name});
            user.info.logged = true;
            await user.save();
        });

        // Send tokens to client
        res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});
        return;
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
        return;
    }
});

app.delete('/logout', auth, async (req, res) => {
    
    // Get refresh token from request
    const refreshToken = req.body.token;

    // Check if token exists
    if(refreshToken == null) return res.sendStatus(400);

    try{
    // Change user logged in status and last online
    dbConn().then(async ({ User }) => {
        const user = await User.findOne({name: req.user.name});
        user.info.logged = false;
        user.info.lastOnline = new Date();
        await user.save();
    });

    // Delete token from database
    dbConn().then(async ({ Token }) => {
        await Token.deleteOne({token: refreshToken});
    });

    // Send response
    res.status(204).json({success: 'User logged out'});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
    return;
});

// Refresh token route for client to get new access token
app.post('/token', async (req, res) => {
    // Get refresh token from request
    const refreshToken = req.body.token;

    // Check if token exists
    if(refreshToken == null) {
        res.sendStatus(400);
        return;
    }

    // Check if token is in database
    dbConn()
    .then(({ Token }) => {
        return new Promise((res) => {
            res(Token.findOne({token: refreshToken}));
        });
    })
    .then((token) => {
        // Verify token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, tokenload) => {
            if(err) {
                res.status(403).json({error: 'Forbidden', content: 'Token not valid'});
                return;
            }

            // Check if token exists
            if(token == null) {


            // Change user logged in status and last online
            dbConn().then(async ({ User }) => {
                const user = await User.findOne({uuid: tokenload.user.uuid});
                user.info.logged = false;
                user.info.lastOnline = new Date();
                await user.save();
            });

            res.status(403).json({error: 'Forbidden', content: 'Token not found'});
            return;
            }

            // Update refresh token
            dbConn().then(({ Token }) => {
                Token.updateOne({token: refreshToken}, {createdAt: new Date()});
            });
            
            // Payload for tokens
            const payload = {
                flags: "refresh",
                user: tokenload.user
            };

            // Create new access token
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '15m' });

            // Send token to client
            res.status(200).json({accessToken: accessToken});
            return;
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
        return;
    });
});

// Start server
const port = process.env.AUTH_PORT || 3001;
app.listen(port, () => {
    console.log(`Auth server listening on port ${port}`);
});