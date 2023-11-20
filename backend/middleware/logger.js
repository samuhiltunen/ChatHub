// Logger middleware

const logger = (req, res, next) => {
    console.log(`[${req.currtime()}] ${req.method} ${req.url}`);
    next();
}

