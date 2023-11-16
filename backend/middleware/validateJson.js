// Middleware to validate JSON

function validateJSON(req, res, next) {
    try {
        if(req.body??0) JSON.parse(req.body);
        next();
    } catch (err) {
        res.status(400).json({error: 'Invalid JSON'});
    }
}

// Export middleware
exports.validateJSON = validateJSON;