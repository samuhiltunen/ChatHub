const { Schema } = require('mongoose');

// Loader ignore

const tokenSchema = new Schema(
    {
        token: String,
        createdAt: Date
    });

// Export model
module.exports = tokenSchema;