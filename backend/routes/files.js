// Import modules
const express = require('express');
const { middleware, database } = require('../loader');


// Import middleware
const { dbConn } = database;
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
        ufid: req.file.filename,
        name: req.file.originalname,
        path: `${req.hostname}/${req.file.filename}`,
        owner: req.user.name,
        size: req.headers['content-length'],
        createdAt: new Date()
    }

    // Add file to database
    dbConn().then(async ({ File }) => {
        const newFile = new File(fileObj);
        await newFile.save();

        res.status(200).json({result: newFile});
    }).catch(()=> {
        res.status(500).json({error: 'Internal server error'});
        return;
    });
})
.get(auth, (req, res) => {
    // Validate query
    if(req.body.query === undefined) {
        res.status(400).json({error: 'Bad request'});
        return;
    }

    // Get files from database
    dbConn().then(async ({ File }) => {
        const files = await File.find().byUFID(req.body.query);
        res.status(200).json({result: files});
    }).catch(() => {
        res.status(500).json({error: 'Internal server error'});
        return;
    });
});

module.exports = router;