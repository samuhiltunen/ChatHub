const mongoose = require('mongoose');

// Create db connection and create models
const dbConn = async () => {
    
    // Connect to database
    await mongoose.connect(`mongodb://metropolia:koulu123@192.168.50.35:27017/chathub`);

    // Import schemas
    const userSchema = require('./schemas/user');
    const tokenSchema = require('./schemas/token');
    const fileSchema = require('./schemas/file');
    const messageSchema = require('./schemas/message');
    const threadSchema = require('./schemas/thread');

    // Create models
    const User = mongoose.model('User', userSchema);
    const Token = mongoose.model('Token', tokenSchema);
    const File = mongoose.model('File', fileSchema);
    const Message = mongoose.model('Message', messageSchema);
    const Thread = mongoose.model('Thread', threadSchema);

    // Return models
    return { User, Token, File, Message, Thread };
}

// Export db connection
module.exports = dbConn;