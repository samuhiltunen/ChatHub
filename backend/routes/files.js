// Import modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const uid = require('uuid');

// Import database controller
const { DbController } = require("../dbController");
const db = new DbController(process.env.MONGO_URI, process.env.MONGO_DB);

// Import middleware
const { auth } = require('../middleware/auth');

// Router
const router = express.Router();

router.route('/:job')
.post(auth, async (req, res) => {
    switch(req.params.job) {
        // Upload file
        case 'upload':
        res.status(200).json({msg: 'Upload file'});
    }    
})

module.exports = router;