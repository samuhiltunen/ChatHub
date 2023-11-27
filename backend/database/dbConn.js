const mongoose = require('mongoose');

// Create db connection and create models
const dbConn = async () => {
    
    // Connect to database
    await mongoose.connect(`mongodb://metropolia:koulu123@192.168.50.35:27017/chathub`);

    // Import schemas
    const userSchema = require('./schemas/user');
    const tokenSchema = require('./schemas/token');
    const fileSchema = require('./schemas/file');

    // Create models
    const User = mongoose.model('User', userSchema);
    const Token = mongoose.model('Token', tokenSchema);
    const File = mongoose.model('File', fileSchema);

    // Return models
    return { User, Token, File };
}

// Export db connection
module.exports = dbConn;