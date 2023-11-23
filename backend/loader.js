// This script loads all modules automatically to aid in importing them
// without having to import each module individually.

const path = require('path');
const fs = require('fs');

// Load middleware
fs.readdirSync(__dirname + '/middleware/').forEach(function(file) {
    if(file == 'export.js') return;
    module.exports[path.basename(file, '.js')] = require(path.join(__dirname + '/middleware/', file));
});

// Load routes
fs.readdirSync(__dirname + '/routes/').forEach(function(file) {
    if(file == 'export.js') return;
    module.exports[path.basename(file, '.js')] = require(path.join(__dirname + '/routes/', file));
});
