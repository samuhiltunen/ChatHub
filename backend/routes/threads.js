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
.post(auth, (req, res) => {
    
    switch(req.params.job) {

        // Create new thread
        case 'create':
            // Validate request
            if(!req.body.title) {
                res.status(400).json({error: 'Bad request'});
                return;
            }

            // Start database connection
            dbConn().then(async ({ Thread, User }) => {
                
                // Stupid to check for duplicate names as utid is already unique
                // Check if thread exists
                //if(await Thread.exists({name: `/^${req.body.name}$/`})) {
                //    res.status(409).json({error: 'Thread already exists'});
                //    return;
                //}
                
                // Populate members array
                const members = [];
                const moderators = [];

                // Add owner to members
                members.push(req.user.uuid);

                // Add moderators to members
                if(Array.isArray(req.body.moderators)) {
                    for(const moderator of req.body.moderators) {
                        if(await User.exists({uuid: moderator})) {
                            members.push(moderator);
                            moderators.push(moderator);
                        }
                    }
                }

                // Add members to members
                if(Array.isArray(req.body.members)) {
                    for(const member of req.body.members) {
                        if(await User.exists({uuid: member}) && !members.includes(member)) {
                            members.push(member);
                        }
                    }
                }                

                // Create thread
                const newThread = new Thread({
                    utid: new ShortUniqueId().randomUUID(8),
                    title: req.body.title,
                    members: members,
                    info: {
                        created: new Date(),
                        lastMessageDate: new Date(),
                        lastMessageUID: null,
                    },
                    options: {
                        owner: req.user.uuid,
                        moderators: moderators,
                        locked: false,
                        nsfw: req.body.nsfw??false,
                    }
                });

                // Save thread to database
                await newThread.save();

                // Response
                res.status(201).json({content: {msg: 'Thread created', thread: newThread}});
            }).catch(() => {
                res.status(500).json({error: 'Internal server error'});
                return;
            });
        break;

        // Update thread
        case 'update':
            // Validate request
            if(!req.body.utid || !Array.isArray(req.body.opers)) {
                res.status(400).json({error: 'Bad request'});
                return;
            }

            // Start database connection
            dbConn().then(async ({ Thread, User }) => {
                // Get thread
                const thread = await Thread.findOne({utid: req.body.utid});

                // Check if thread exists
                if(thread === null) {
                    res.status(404).json({error: 'Thread not found'});
                    return;
                }

                // Check if user has permission
                if(thread.options.owner !== req.user.uuid && !thread.options.moderators.includes(req.user.uuid)) {
                    res.status(403).json({error: 'Forbidden'});
                    return;
                }

                // Success array
                let success = [];

                // Loop through operations
                for(const oper of req.body.opers) {
                    switch(oper.type) {
                        case 'title':
                            thread.title = oper.value??thread.title;
                            success.push(oper.type + ' ' + oper.value);
                        break;

                        case 'members':
                            if(!Array.isArray(oper.value)) break;
                            for(const member of oper.value) {
                                // Check if member exists and is not the owner
                                if(User.exists({uuid: member}) && req.user.uuid !== member) {
                                    // Add or remove member

                                    // Check if member is already in members array
                                    if(oper.action === 'add' && !thread.members.includes(member)) {
                                        thread.members.push(member);

                                    // Check if member is in members array
                                    } else if(oper.action === 'remove' && thread.members.includes(member)) {
                                        thread.members.splice(thread.members.indexOf(member), 1);
                                    } else {
                                        break;
                                    }
                                }
                            }
                            success.push(oper.type + ' ' + oper.action + ' ' + oper.value);
                        break;

                        case 'moderators':
                            if(!Array.isArray(oper.value) || req.user.uuid !== thread.options.owner) break;
                            for(const moderator of oper.value) {
                                if(User.exists({uuid: moderator}) && req.user.uuid !== moderator) {
                                    
                                    // Check if moderator is already in moderators array
                                    if(oper.action === 'add' && !thread.options.moderators.includes(moderator)) {
                                        thread.options.moderators.push(moderator);
                                    
                                    // Check if moderator is in moderators array
                                    } else if(oper.action === 'remove' && thread.options.moderators.includes(moderator)) {
                                        thread.options.moderators.splice(thread.options.moderators.indexOf(moderator), 1);
                                    } else {
                                        break;
                                    }
                                }
                            }
                            success.push(oper.type + ' ' + oper.action + ' ' + oper.value);
                        break;

                        case 'nsfw':
                            thread.options.nsfw = oper.value??thread.options.nsfw;
                            success.push(oper.type + ' ' + oper.value);
                        break;

                        case 'locked':
                            if(req.user.uuid === thread.options.owner) {
                                thread.options.locked = oper.value??thread.options.locked;
                                success.push(oper.type + ' ' + oper.value);
                            }
                        break;

                        case 'owner':
                            if(req.user.uuid === thread.options.owner) {

                                // Check if owner exists
                                if(!await User.exists({uuid: oper.value})) break;

                                thread.options.owner = oper.value??thread.options.owner;
                                success.push(oper.type + ' ' + oper.value);
                            }
                        break;
                    }
                }
                
                // Save thread to database
                await thread.save();

                // Response
                res.status(200).json({content: success});
            }).catch(() => {
                res.status(500).json({error: 'Internal server error'});
                return;
            });
        break;

        // Default
        default:
            res.status(400).json({error: 'Bad request'});
    }
})
// Delete thread
.delete(auth, (req, res) => {
    // Validate request
    if(!req.body.utid) {
        res.status(400).json({error: 'Bad request'});
        return;
    }

    // Start database connection
    dbConn().then(async ({ Thread }) => {
        // Get thread
        const thread = await Thread.findOne({utid: req.body.utid});

        // Check if thread exists and user is owner
        if(thread === null) {
            res.status(404).json({error: 'Thread not found'});
            return;
        }

        // If user wants to leave thread
        if(req.params.job === 'leave') {
            // Check if user is owner
            if(thread.options.owner === req.user.uuid) {
                // If user is owner and only member, delete thread
                if(thread.members.length === 1) {
                    await Thread.deleteOne({utid: req.body.utid});
                    res.status(204).json({content: 'Thread deleted'});
                    return;
                }

                // If user is owner and not only member, transfer ownership to first moderator else first member
                if(thread.options.moderators.length > 0) {
                    thread.options.owner = thread.options.moderators[0];
                    thread.options.moderators.splice(0, 1);
                    await thread.save();
                    res.status(200).json({content: 'Ownership transferred'});
                    return;
                } else {
                    thread.options.owner = thread.members[0];
                    await thread.save();
                    res.status(200).json({content: 'Ownership transferred'});
                    return;
                }
            }

            // Check if user is moderator
            if(thread.options.moderators.includes(req.user.uuid)) {
                thread.options.moderators.splice(thread.options.moderators.indexOf(req.user.uuid), 1);
            }

            // Check if user is member
            if(thread.members.includes(req.user.uuid)) {
                thread.members.splice(thread.members.indexOf(req.user.uuid), 1);
            } else {
                res.status(404).json({error: 'User not found in thread'});
                return;
            }

            // Save thread to database
            await thread.save();

            // Response
            res.status(200).json({content: 'Left thread'});
            return;
        }

        // Check if user has permission
        if(thread.options.owner !== req.user.uuid) {
            res.status(403).json({error: 'Forbidden'});
            return;
        }

        // Delete thread
        await Thread.deleteOne({utid: req.body.utid});

        // Response
        res.sendStatus(204) //.json({content: 'Thread deleted'});
    }).catch(() => {
        res.status(500).json({error: 'Internal server error'});
        return;
    });
})
// Get thread
.get(auth, (req, res) => {
    // Find thread in database
    dbConn().then(async ({ Thread }) => {
        new Promise((res) => {
            
            const search = {};

            // Make search object
            for(const [key, val] of Object.entries(req.query)) {
                
                // Check if key is regex
                if(RegExp('^/.*/$').test(val)) {
                    search[key] = RegExp(val.slice(1, -1));
                    continue;
                }
                search[key] = val;
            }
            res(Thread.find().byMult(search));
        })
        .then(result => {
        res.status(200).json({content: result});
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: 'Internal server error'});
    });
});

// Export router
module.exports = router;