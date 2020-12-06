const path = require("path");
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const CONSTS = require('./constants');
const login_authorize = require('../middleware/login-authorize');

// Importing the user model as User
const User = require('../models/wanderer');
const mongoose = require('mongoose');
const router = require("./user-account");

// Router to access protected resources like feed
// The router passes through the authentication middleware
router.get('/protected', login_authorize, (req, res) => {
    res.json({message: "Welcome back! This is your home page!"});
})

// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb", CONSTS.MONGO_OPTIONS);

// Since mongoose promise is depricated, override it with NodeJS promises
mongoose.Promise = global.Promise;

/* The authorized user on clicking the follow button on another 
profile, sends the ID of the profile clicked. */

// The followers array of the profile clicked should be populated. 
// The following array of the user who clicked the follow button should be populated.

router.put('/follow', login_authorize, (req, res) => {
    var Celebrity;
    var Me;
    
    var theOrdinaryMe = {
        follow_unfollowID: req.user._id,
        follow_unfollowUsername: req.user.username
    };

    if((req.body.toFollowID).toString() === (req.user._id).toString()) {
        return res.status(422).json({message:"You can't follow yourself :)"});
    }
    // Push to the followers array of the toUnFollowID user
    User.findByIdAndUpdate(req.body.toFollowID, {
        $push:{followers:theOrdinaryMe}
    }, {new: true}, (err, result) => {
        if(err) {
           return res.status(404).json({error:err});
        }
        Celebrity = result;
        // Update the follwing array of the user who followed toUnFollowID
        var theCelebrity = {
            follow_unfollowID:req.body.toFollowID,
            follow_unfollowUsername:Celebrity.username
        };
        User.findByIdAndUpdate(req.user._id, {
            $push: {following:theCelebrity}
        }, {new: true}, (err, result) => {
            if(err) {
                return res.status(422).json({error:err});
            }
            Me = result;
            console.log(`${Celebrity.username} got followed by ${Me.username} successfully!`)
            return res.status(200).json({message: "Successfully Followed"});
        })
    })
})

/* The authenticated user, on clicking the unfollow button 
on another profile, sends the ID of the profile clicked. */

// The unfollowers array of the profile clicked is depopulated.
// The following array of the user who who unfollows is depopulated.

router.put('/unfollow', login_authorize, (req, res) => {
    var Celebrity;
    var Me;
    var theOrdinaryMe = {
        follow_unfollowID:req.user._id,
        follow_unfollowUsername:req.user.username
    };
    // Pull from the followers array of the toUnFollowID user
    User.findByIdAndUpdate(req.body.toUnFollowID, {
        $pull:{followers:theOrdinaryMe}
    }, {new: true}, (err, result) => {
        if (err) {
           return res.status(404).json({error:err});
        }
        Celebrity = result;
        // Update the following array of the user who unfollowed toUnFollowID
        var theCelebrity = {
            follow_unfollowID:req.user._id,
            follow_unfollowUsername:req.user.username
        };
        User.findByIdAndUpdate(req.user._id, {
            $pull: {following:theCelebrity}
        }, {new: true}, (err, result) => {
            if(err) {
                return res.status(422).json({error:err});
            }
            Me = result;
            console.log(`${Celebrity} got unfollowed by ${Me} successfully!`)
            return res.status(200).json({message:"Successfully Unfollowed"});
        });
    });
});

// Fetch all users 
router.get("/get-all-users", (req, res) => {
    User.find({}, (err, result) => {
        if(err) {
           return res.json({error:err});
        }
        return res.json({message:result});
    })
});

// Testing route
router.get("/whoamI", login_authorize, (req, res) => {
    return res.json({message:req.user});
})

module.exports = router;