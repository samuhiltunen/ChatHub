// Import modules
const express = require('express');
const path = require('path')

// App
const app = express();

// Middleware
const { cors } = require('./middleware/cors');

// Import routes
const files = require('./routes/files');

// Serve static files
app.use(express.static(path.join(__dirname, 'files')));
app.use(cors);
app.use('/files', files)

const port = process.env.FILE_PORT || 3002;

// Listen
app.listen(port, () => {
    console.log(`File server listening on port ${port}`);
})

// Peten wifi salasana
//28995339589