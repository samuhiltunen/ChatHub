const { Schema } = require('mongoose');

// Loader ignore

const messageSchema = new Schema(
    {
        umid: String,
        content: String,
        info: {
            sent: Date,
            edited: Date,
            sender: String,
            thread: String,
        }
    },{
        query: {
            byUMID(umid) {
                return this
                .where({ muid: new RegExp(`^${umid}$`) })
                .select('-_id -__v');
            },
            byThread(thread) {
                return this
                .where({ 'info.thread': new RegExp(`^${thread}$`) })
                .select('-_id -__v');
            },
            bySender(sender) {
                return this
                .where({ 'info.sender': new RegExp(`^${sender}$`) })
                .select('-_id -__v');
            },
            byMult(query) {
                return this
                .where(query)
                .select('-_id -__v');
            },
        }
    }
    );

// Export model
module.exports = messageSchema;