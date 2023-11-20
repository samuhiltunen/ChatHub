// Import modules
const express = require('express');
const path = require('path')
const cors = require('cors');

// App
const app = express();

// Middleware
//const { cors } = require('./middleware/cors');
const { logger } = require('./middleware/logger');

// Import routes
const files = require('./routes/files');

// Serve static files
app.use(express.static(path.join(__dirname, 'files')));
app.use(cors);
app.use('/files', files)
app.use(logger)

const port = process.env.FILE_PORT || 3002;

// Listen
app.listen(port, () => {
    console.log(`File server listening on port ${port}`);
})

// Peten wifi salasana
//28995339589