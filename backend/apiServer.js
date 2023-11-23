const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

// Import modules
const { middleware, routes } = require('./loader');

// Import middleware
const { timestamp, logger, validateJSON, motd } = middleware;

// Import routes
const { users } = routes;

// Global Middleware
app.use(express.json());
app.use(timestamp);
app.use(logger);
app.use(validateJSON);
app.use(motd);

// Routes
app.use('/users', users);

// Start server
const port = process.env.API_PORT || 3000;
app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});
