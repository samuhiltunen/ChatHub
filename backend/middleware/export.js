// File that has all the middleware functions for easier importing

// Import modules
const {auth} = require('./auth');
const {cors} = require('./cors');
const {logger} = require('./logger');
const {motd} = require('./motd');
const {validateJSON} = require('./validateJson');
const {timestamp} = require('./timestamp');
const {login} = require('./login');

// Export modules
module.exports = { auth, cors, logger, motd, validateJSON, timestamp, login };