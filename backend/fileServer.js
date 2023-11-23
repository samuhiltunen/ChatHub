// Import modules
const express = require('express');
const path = require('path')
const cors = require('cors');

// App
const app = express();

// Import modules
const { middleware, routes } = require('./loader');

// Import middleware
const { timestamp, logger } = middleware;

// Import routes
const { files } = routes;

// Serve static files
app.use(cors());
app.use(timestamp)
app.use(logger);
app.use(express.static(path.join(__dirname, 'files')));

// Routes
app.use('/files', files)

// Listen
const port = process.env.FILE_PORT || 3002;
app.listen(port, () => {
    console.log(`File server listening on port ${port}`);
})

// Peten wifi salasana
//28995339589