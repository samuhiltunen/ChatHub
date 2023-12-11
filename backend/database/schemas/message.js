const { Schema } = require('mongoose');

// Loader ignore

const messageSchema = new Schema(
    {
        umid: String,
        author: String,
        content: [String],
        info: {
            sent: Date,
            edited: Date,
            authorUUID: String,
            utid: String,
            attatchments: [String],
        }
    },{
        query: {
            byUMID(umid) {
                return this
                .where({ umid: new RegExp(`^${umid}$`) })
                .select('-_id -__v');
            },
            // By thread
            byThread(utid, amnt, date) {
                return this
                .where({ 'info.utid': new RegExp(`^${utid}$`) })
                // If date is not specified, return messages sent before current time
                // If date is specified, return messages sent after specified date
                // Dates are confusing :(
                .where({ 'info.sent': date?{$gt: date}:{$lt: new Date()} })
                .limit(amnt)
                .sort({ 'info.sent': -1 })
                .select('-_id -__v');
            },
            bySender(sender) {
                return this
                .where({ 'info.sender': new RegExp(`^${sender}$`) })
                .select('-_id -__v');
            }
        }
    }
    );

// Export model
module.exports = messageSchema;