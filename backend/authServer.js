
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { DbController } = require('./dbController');
const db = new DbController(process.env.MONGO_URI, process.env.MONGO_DB);

// Import middleware
const { login } = require('./middleware/login');
const { validateJSON } = require('./middleware/validateJson');

app.use(validateJSON);
app.use(express.json());

// Login route for client to authenticate
app.post('/login', login, async (req, res) => {
    // Authenticate user
    try {
         
        // Get user from middleware
        const user = req.user;

        // Create tokens
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '15m' });
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);

        // Add refresh token to database
        // MongoDB will automatically remove tokens after 1 day
        const response = await db.update("tokens", {token: refreshToken},
            {$set: {createdAt: new Date(), token: refreshToken}}, 
            {upsert: true});

        console.log(response);

        // Send tokens to client
        res.status(200).json({accessToken: accessToken, refreshToken: refreshToken});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    }
});

// Refresh token route for client to get new access token
app.post('/token', async (req, res) => {
    // Get refresh token from request
    const refreshToken = req.body.token;

    // Check if token exists
    if(refreshToken == null) return res.sendStatus(401);

    // Check if token is in database
    const token = await db.find("tokens", {token: refreshToken}, {}, true);
    if(token === null) return res.sendStatus(403);

    // Verify token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if(err) return res.sendStatus(403);

        const payload = {
            name: user.name,
            pass: user.pass,
            info: user.info
        };

        // Create new access token
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '15m' });
        res.status(200).json({accessToken: accessToken});
    });
});

// Start server
app.listen(4000, () => {
    console.log('Server started on port 4000');
});