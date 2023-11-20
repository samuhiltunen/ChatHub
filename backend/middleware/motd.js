// Displays a message of the day on the endpoint index

// Get endpoint uri

const motd = (req, res, next) => {
    
    // Get endpoint
    const endpoint = req.protocol + '://' + req.get('host');

    if(req.method === "GET" && req.url === "/") {
        res.status(200).send(endpoint);
    }
    next();
}

// Export middleware
module.exports = { motd };