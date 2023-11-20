const express = require('express');
const app = express();
const cors = require('cors');

// Import middleware
const { validateJSON }= require('./middleware/validateJson');
const { motd } = require('./middleware/motd');
//const { cors } = require('./middleware/cors');
const { logger } = require('./middleware/logger');

// Import routes
const users = require('./routes/users');

// Global Middleware
app.use((req, res, next) => {
    req.currtime = new Date().getTime;
    next();
});

app.use(express.json());
app.use(validateJSON);
app.use(motd);
app.use(cors);
app.use(logger);

// Routes
app.use('/users', users);

const port = process.env.API_PORT || 3000;

// Start server
app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});
