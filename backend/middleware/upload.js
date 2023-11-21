const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {DbController} = require('../dbController');
const { default: ShortUniqueId } = require('short-unique-id');
const db = new DbController(process.env.MONGO_URI, process.env.MONGO_DB);
const uid = new ShortUniqueId({length: 10});

const fileFilter = (req, file, cb) => {
    // Allowed extensions
    const fileTypes = /jpeg|jpg|png|gif|wav|ogg|mp3|mp4|avi|pdf/;
    // Check extension
    if(fileTypes.test(path.extname(file.originalname).toLocaleLowerCase())) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../files'));
    },
    filename: function(req, file, cb) {
        const folder = file.mimetype.split('/')[0];
        
        // Check if folder exists and create if not
        if(!fs.existsSync(path.join(__dirname, `../files/${folder}`))) {
            fs.mkdirSync(path.join(__dirname, `../files/${folder}`));
        }

        const dir = `${folder}/${uid.rnd()}.${file.originalname.split('.').pop()}`
        cb(null, dir);
    }
});

const upload = multer({storage: storage, fileFilter: fileFilter});

// Export middleware
module.exports = {upload};