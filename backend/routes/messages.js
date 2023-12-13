// Import modules
const express = require('express');
const ShortUniqueId = require('short-unique-id');
const { middleware, database } = require('../loader');


// Import middleware
const { dbConn } = database;
const { auth } = middleware;

// Router
const router = express.Router();

router.route('/:job')
.post(auth, async (req, res) => {
    switch(req.params.job) {
        
        // Create new message
        case 'create':
            
            // Check if request is valid
            if(!req.body.utid) {
                res.status(400).json({error: 'Bad request'});
                return;
            }

            // Start database connection
            dbConn().then(async ({ Message, Thread }) => {

                //console.log(req.body.utid);

                // Check if thread exists
                if(!await Thread.exists({ utid: req.body.utid })) {
                    res.status(404).json({error: 'Thread not found'});
                    return;
                }

                // Create new message
                const newMessage = new Message({
                    umid: new ShortUniqueId().randomUUID(8),
                    author: req.user.name,
                    content: [req.body.content??''],
                    info: {
                        sent: new Date(),
                        edited: null,
                        authorUUID: req.user.uuid,
                        utid: req.body.utid,
                        attatchments: req.body.attachments ?? [],
                    },
                });

                // Save new message
                await newMessage.save();

                // Send response
                res.status(200).json({content: newMessage});
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: 'Internal server error'});
                return;
            });
            break;

        // Edit message
        case 'update':

            // Check if request is valid
            if(!req.body.umid || !req.body.content) {
                res.status(400).json({error: 'Bad request'});
                return;
            }

            // Start database connection
            dbConn().then(async ({ Message }) => {

                // Check if message exists
                if(!await Message.exists({ umid: req.body.umid })) {
                    res.status(404).json({error: 'Message not found'});
                    return;
                }

                // Update message
                await Message.updateOne(
                    { umid: req.body.umid },
                    { $push: { content: req.body.content }, 'info.edited': new Date() }
                );

                // Send response
                res.status(200).json({content: 'Message updated'});
            });

            break;

        // 404
        default:
            res.status(404).json({error: 'Job not found'});
    }
})
.delete(auth, async (req, res) => {
    // Delete message

    // Check if request is valid
    if(!req.body.umid) {
        res.status(400).json({error: 'Bad request'});
        return;
    }

    // Start database connection
    dbConn().then(async ({ Message }) => {

        // Check if message exists
        if(!await Message.exists({ umid: req.body.umid })) {
            res.status(404).json({error: 'Message not found'});
            return;
        }

        // Delete message content
        await Message.updateOne(
            { umid: req.body.umid },
            { $set: { content: ['Message deleted.'] }, 'info.edited': new Date() }
        );

        // Send response
        res.sendStatus(204);
    });
})
.get(auth, async (req, res) => {
    // Get message

    // Check if request is valid
    // God what I would do for a logical XOR operator
    if(!req.query.umid && !req.query.utid) {
        res.status(400).json({error: 'Bad request'});
        return;
    }

    // Start database connection
    dbConn().then(async ({ Message, File }) => {

        // Find message by umid
        if(req.query.umid) {
            // Find message
            const message = await Message.find().byUMID(req.query.umid);

            // Check if message exists
            if(message.length === 0) {
                res.status(404).json({error: 'Message not found'});
                return;
            }

            console.log(message);

            // Change message attatchments to file objects if they exist
            if(message[0].info.attatchments.length === 0) {
                const files = [];
                for(const file of message[0].info.attatchments) {
                    const fileObj = await File.find().byUFID(file);
                    files.push(fileObj[0]);
                }
                // Change message attatchments to file objects
                message[0].info.attatchments = files;
            }

            // Send response
            res.status(200).json({content: message});
        } else {
        
            const amnt = req.query.amnt ?? 10;
            const date = req.query.date ?? null;

            // Find messages by thread
            const messages = await Message.find().byThread(req.query.utid, amnt, date)

            // Check if messages exist
            if(!messages) {
                res.status(404).json({error: 'Messages not found'});
                return;
            }

            // Send response
            res.status(200).json({content: messages});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
        return;
    });
});

// Export router
module.exports = router;