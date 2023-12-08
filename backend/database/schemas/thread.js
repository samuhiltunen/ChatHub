const { Schema } = require('mongoose');

// Loader ignore

const threadSchema = new Schema(
    {
        utid: String,
        title: String,
        members: Array,
        info: {
            created: Date,
            lastMessageDate: Date,
            lastMessageUID: String,
        },
        options: {
            owner: String,
            moderators: Array,
            locked: Boolean,
            nsfw: Boolean,
        },
    },{
        query: {
            byUTID(utid) {
                return this
                .where({ utid: new RegExp(`^${utid}$`) })
                .select('-_id -__v');
            },
            byOwner(owner) {
                return this
                .where({ 'options.owner': new RegExp(`^${owner}$`) })
                .select('-_id -__v');
            },
            byMult(query) {
                return this
                .where(query)
                .select('-_id -__v');
            },
        }
    });

// Export model
module.exports = threadSchema;