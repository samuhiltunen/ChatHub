// Import modules
const express = require('express');

// Import database controller
const { DbController } = require("../dbController");
const db = new DbController(process.env.MONGO_URI, process.env.MONGO_DB);

// Import middleware
const { middleware } = require('../loader');
const { auth, upload } = middleware;

// Router
const router = express.Router();

router.route('/')
.post(auth, upload.single('file'), (req, res) => {
    // Check if file was uploaded
    if(req.file === undefined) {
        res.status(400).json({error: 'Bad request'});
        return;
    }

    // Create file object
    const fileObj = {
        name: req.file.originalname,
        path: `${req.hostname}/${req.file.filename}`,
        owner: req.user.name,
        size: req.headers['content-length'],
        createdAt: new Date()
    }

    // Add file to database
    db.insert("files", [fileObj])
    .then(result => {
        res.status(200).json({msg: 'File uploaded', file: fileObj});
    })
    .catch(err => {
        res.status(500).json({error: "Internal server error"});
    });
})
.get(auth, (req, res) => {
    // Validate query
    if(req.body.query === undefined) {
        res.status(400).json({error: 'Bad request'});
        return;
    }

    // Get files from database
    let options = {
        sort: req.body.sort ?? {},
        projection: req.body.proj ?? {path: 1},
    };
    for(const [key, val] of Object.entries(options.projection)) {
        if(!val) delete options.projection[key];
    }
    const single = Array.isArray(req.body.query);

    db.find("files", req.body.query, options, single)
    .then(result => {
        res.status(200).json({result: result});
    })
    .catch(err => {
        res.status(500).json({error: "Internal server error"});
    });
});

module.exports = router;