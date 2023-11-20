const express = require('express');
const app = express();
const cors = require('cors');

// Import middleware
const { validateJSON, motd, logger, timestamp }= require('./middleware/export');

// Import routes
const users = require('./routes/users');

// Global Middleware
app.use(cors());
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
