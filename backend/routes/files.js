// Import modules
const express = require('express');
const busboy = require('connect-busboy');
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

router.use(busboy());

const filebus = (req, res) => {
    if (req.busboy) {
      req.busboy.on('file', (name, file, info) => {
        console.log('File [' + name + ']: filename: ' + info.filename);
      });
      req.busboy.on('field', (name, value, info) => {
      });
      req.pipe(req.busboy);
    }
    next();
  };

router.route('/')
.post(auth, filebus, async (req, res) => {
    // Upload file
    res.status(200).json({message: 'File uploaded'});
})

module.exports = router;