const express = require('express');
const app = express();

// Import middleware
const { validateJSON }= require('./middleware/validateJson');

// Import routes
const users = require('./routes/users');

// Global Middleware
app.use((req, res, next) => {
    req.currtime = new Date().getTime;
    next();
});

app.use(validateJSON);

app.use(express.json());

// Routes
app.use('/users', users);

// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
