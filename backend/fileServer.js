// Import modules
const express = require('express');
const path = require('path')
const cors = require('cors');

// App
const app = express();
app.use(cors());

// Import modules
const { middleware, routes } = require('./loader');

// Import middleware
const { timestamp, logger } = middleware;

// Import routes
const { files } = routes;

// Serve static files
app.use(timestamp)
app.use(express.static(path.join(__dirname, 'files')));
app.use(logger);

// Routes
app.use('/files', files)

// Listen
const port = process.env.FILE_PORT || 3002;
app.listen(port, () => {
    console.log(`File server listening on port ${port}`);
    return;
})

// Peten wifi salasana
//28995339589