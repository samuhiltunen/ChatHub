const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

// Import modules
const { middleware, routes } = require('./loader');

// Import middleware
const { timestamp, logger, validateJSON, motd } = middleware;

// Import routes
const { users, threads } = routes;

// Global Middleware
app.use(express.json());
app.use(timestamp);
app.use(validateJSON);
app.use(motd);
app.use(logger);

// Routes
app.use('/users', users);
app.use('/threads', threads);

// Start server
const port = process.env.API_PORT || 3000;
app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});
