const path = require("path");
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const CONSTS = require('./constants');
const login_authorize = require('../middleware/login-authorize');

//importing the user model as User
const User = require('../models/wanderer');
const mongoose = require('mongoose');
const router = require("./user-account");

//router for accessing proteted resource like his feed
router.get('/protected',login_authorize,(req,res)=>{//this route has to pass through the middle wear
    res.json({message:"Hi user!This is your home page!"});
})

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb",{ useUnifiedTopology: true, useNewUrlParser: true });

//since mongoose promise is deprecated,lets override it node js promise
mongoose.Promise = global.Promise;

router.put('/follow',login_authorize,(req,res)=>{//the logged in user(login_authorize) on clicking the follow button of a particular user profile will supply the id of the profile clicked.Hence the followers array of the profile clicked should be populated.Also the following array of the user who clicked the follow button should be populated.
    var Celebrity;
    var Me;
    
    var theOrdinaryMe = {
        follow_unfollowID:req.user._id,
        follow_unfollowUsername:req.user.username
    };

    if((req.body.toFollowID).toString() === (req.user._id).toString())
    {
        return res.status(422).json({message:"You can't follow yourself :)"});
    }
    //push into the followers array of the toUnFollowID user
    User.findByIdAndUpdate(req.body.toFollowID,{
        $push:{followers:theOrdinaryMe}
    },{new:true},(err,result)=>{
        if(err){
           return res.status(404).json({error:err});
        }
        Celebrity = result;
        //now update the follwing array of the user who followed toUnFollowID
        var theCelebrity = {
            follow_unfollowID:req.body.toFollowID,
            follow_unfollowUsername:Celebrity.username
        };
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:theCelebrity}
        },{new:true},(err,result)=>{
            if(err){
                return res.status(422).json({error:err});
            }
            Me = result;
            console.log(`${Celebrity.username} got followed by ${Me.username} successfully!`)
            return res.status(200).json({message:"Successfully Followed"});
        })
    })
})

router.put('/unfollow',login_authorize,(req,res)=>{//the logged in user(login_authorize) on clicking the unfollow button of a particular user profile will supply the id of the profile clicked.Hence the unfollowers array of the profile clicked should be depopulated.Also the following array of the user who clicked the follow button should be depopulated.
    var Celebrity;
    var Me;
    var theOrdinaryMe = {
        follow_unfollowID:req.user._id,
        follow_unfollowUsername:req.user.username
    };
    //pull from the followers array of the toUnFollowID user
    User.findByIdAndUpdate(req.body.toUnFollowID,{
        $pull:{followers:theOrdinaryMe}
    },{new:true},(err,result)=>{
        if(err){
           return res.status(404).json({error:err});
        }
        Celebrity = result;
        //now update the follwing array of the user who unfollowed toUnFollowID
        var theCelebrity = {
            follow_unfollowID:req.user._id,
            follow_unfollowUsername:req.user.username
        };
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:theCelebrity}
        },{new:true},(err,result)=>{
            if(err){
                return res.status(422).json({error:err});
            }
            Me = result;
            console.log(`${Celebrity} got unfollowed by ${Me} successfully!`)
            return res.status(200).json({message:"Successfully Unfollowed"});
        });
    });
});

//for my testing purposes only : or actually can be used as a feature and fetch all users :)
router.get("/get-all-users",(req,res)=>{
    User.find({},(err,result)=>{
        if(err){
           return res.json({error:err});
        }
        return res.json({message:result});
    })
});

//ony for testing
router.get("/whoamI",login_authorize,(req,res)=>{
    return res.json({message:req.user});
})

module.exports = router;