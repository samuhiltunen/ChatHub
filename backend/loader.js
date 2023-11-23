// This script loads all modules automatically to avoid having to import them manually in every file.
// Loader ignores files that have '// Loader ignore' in them.

const path = require('path');
const fs = require('fs');

const loadDir = ['database', 'middleware', 'routes'];

// Module objects
const database = {};
const middleware = {};
const routes = {};

// Load scripts
for(const dir of loadDir) {
    fs.readdirSync(`${__dirname}/${dir}/`).forEach(function(file) {

        // Skip directories (e.g. .gitkeep)
        if(!fs.lstatSync(`${__dirname}/${dir}/${file}`).isFile()) return; 

        // Read file to buffer
        const fileBuffer = fs.readFileSync(`${__dirname}/${dir}/${file}`);

        // Check if file is to be ignored or doesn't have module.exports
        if(fileBuffer.toString().includes('// Loader ignore') || !fileBuffer.toString().includes('module.exports')) {
            console.log(`Ignoring ${file}`);
            return;
        }

        // Load file to right module
        const moduleData = require(`${__dirname}/${dir}/${file}`);
        const moduleName = path.basename(file, '.js');

        switch(dir) {
            case 'database':
                database[moduleName] = moduleData;
                break;
            case 'middleware':
                middleware[moduleName] = moduleData;
                break;
            case 'routes':
                routes[moduleName] = moduleData;
                break;
        }
    });
    switch(dir) {
        case 'database':
            module.exports.database = database;
            break;
        case 'middleware':
            module.exports.middleware = middleware;
            break;
        case 'routes':
            module.exports.routes = routes;
            break;
    }
}
