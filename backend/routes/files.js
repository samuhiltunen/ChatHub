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

    console.log('file upload');

    if(req.file === undefined) {
        res.status(400).json({error: 'Bad request'});
        return;
    }

    // Create file object
    const fileObj = {
        ufid: req.file.filename.split('/')[1].split('.')[0], // Dumb way to get ufid but im lazy
        name: req.file.originalname,
        path: `${req.hostname}/${req.file.filename}`,
        ownerUUID: req.user.uuid,
        size: req.headers['content-length'],
        createdAt: new Date()
    }

    // Add file to database
    dbConn().then(async ({ File }) => {
        const newFile = new File(fileObj);
        await newFile.save();

        res.status(200).json({content: fileObj});
    }).catch(()=> {
        res.status(500).json({error: 'Internal server error'});
        return;
    });
})
.get(auth, (req, res) => {
    // Validate query
    if(req.query.ufid === undefined) {
        res.status(400).json({error: 'Bad request'});
        return;
    }

    // Get files from database
    dbConn().then(async ({ File }) => {
        const files = await File.find().byUFID(req.query.ufid);

        // Check if we should download file
        if(req.query.download !== 'true')
            res.status(200).json({result: files});
        else {
            // Download file
            const path = files[0].path.replace(req.hostname, 'backend/files');
            res.download(path, files[0].name);
        }
    }).catch(() => {
        res.status(500).json({error: 'Internal server error'});
        return;
    });
});

module.exports = router;