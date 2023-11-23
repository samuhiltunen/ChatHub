const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { DbController } = require('./dbController');
const db = new DbController(process.env.MONGO_URI, process.env.MONGO_DB);
const app = express();

// Import middleware
const { timestamp, logger, validateJSON, motd, auth, login } = require('./loader');

app.use(cors());
app.use(express.json());
app.use(timestamp);
app.use(logger);
app.use(validateJSON);
app.use(motd);

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
        const response = await db.update("tokens", {token: refreshToken},
            {$set: {createdAt: new Date(), token: refreshToken}}, 
            {upsert: true});

        // Update user logged in status
        await db.update("users", {name: req.user.name}, {$set: {"info.logged": true}});

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
    await db.update("users", {name: req.user.name}, {$set: {"info.logged": false, "info.lastOnline": new Date()}});

    // Delete token from database
    await db.delete("tokens", {token: refreshToken})
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
    if(refreshToken == null) return res.sendStatus(400);

    // Check if token is in database
    const token = await db.find("tokens", {token: refreshToken}, {}, true);
    if(token === null) return res.sendStatus(401);

    // Verify token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN,async (err, data) => {
        if(err) return res.sendStatus(403);

        // Refresh refresh token in database
        await db.update("tokens", {token: refreshToken}, {$set: {createdAt: new Date()}});

        // Payload for new access token
        const payload = {
            flags: "refresh",
            user: data.user
        };

        // Create new access token
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '15m' });
        res.status(200).json({accessToken: accessToken});
    });
    return;
});

// Start server
const port = process.env.AUTH_PORT || 3001;
app.listen(port, () => {
    console.log(`Auth server listening on port ${port}`);
});