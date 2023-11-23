const { Schema } = require('mongoose');

// Loader ignore

// Remove sensitive data from user object
function filter(arr) {
    if(Array.isArray(arr)) {
        return arr.map(user => {
            const { pass, _id, __v, ...rest } = user;
            return rest;
        });
    } else {
        const { pass, _id, __v, ...rest } = arr;
        return rest;
    }
}

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
            this.where({ uuid: new RegExp(uuid, 'i') });
        }
    }
});

// Export model
module.exports = userSchema;