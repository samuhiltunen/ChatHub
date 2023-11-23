// Middleware to validate JSON

function validateJSON(req, res, next) {
    try {
        if(req.body??0) JSON.parse(req.body);
    } catch (err) {
        res.JSONvalid = false;
    }
    next();
}

// Export middleware
module.exports = validateJSON;