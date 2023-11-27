const { Schema } = require('mongoose');

// Loader ignore

const fileSchema = new Schema(
{
    ufid: String,
    name: String,
    path: String,
    owner: String,
    size: Number,
    createdAt: Date
},{
    query: {
        byUFID(ufid) {
            return this
            .where({ ufid: new RegExp(`^${ufid}$`) })
            .select('-_id -__v');
        }
    }
});

// Export model
module.exports = fileSchema;