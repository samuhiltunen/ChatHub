const { Schema } = require('mongoose');

// Loader ignore

const userSchema = new Schema(
{
    uuid: String,
    name: String,
    pass: String,
    info: {
        avatar: String,
        status: String,
        bio: String,
        logged: Boolean,
        userCreated: Date,
        lastOnline: Date
    }
},{
    query: {
        byUUID(uuid) {
            return this
                .where({ uuid: new RegExp(`^${uuid}$`) })
                .select('-pass -_id -__v');
        },
        byName(name) {
            return this
                .where({ name: new RegExp(name)})
                .select('-pass -_id -__v');
        },
        byMult(query) {
            return this
            .where(query)
            .select('-pass -_id -__v');
        }
    }
});

// Export model
module.exports = userSchema;