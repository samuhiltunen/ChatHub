// Mongoose test

const { dbConn } = require('../loader');

dbConn().then(async ({ User }) => {
    console.log('Connected to database');
    
    const newUser = new User({
        name: 'username',
        pass: 'userpass',
        info: {
            avatar: 'test',
            status: 'test',
            bio: 'test',
            logged: false,
            userCreated: new Date(),
            lastOnline: null
        }
    });
    
    await newUser.save();
})
.catch(err => {
    console.log(err);
});