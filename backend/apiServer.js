const express = require('express');
const app = express();
const cors = require('cors');

// Import middleware
const { validateJSON, motd, logger, timestamp }= require('./middleware/export');

// Import routes
const users = require('./routes/users');

// Global Middleware
app.use(timestamp);
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
