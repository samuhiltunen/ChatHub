// Cors middleware

var corsModule = require('cors');

const cors = corsModule({
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
});

// Export middleware
module.exports = { cors };