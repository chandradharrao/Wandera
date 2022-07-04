const path = require("path");
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const CONSTS = require('./constants');
const login_authorize = require('../middleware/login-authorize');
const ObjectId = require('mongodb').ObjectId;

// Importing the user model as User
const User = require('../models/user');
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

//input: toFollow user_id
/* 
    ->Add the toFollowid into the users follwoing list
    ->add the users_id to the followers list of the toFollowid user
*/
router.post('/follow', login_authorize, async (req, res) => {
    try{
        if(req.body.toFollowID.toString() === req.user._id.toString()){
            return res.status(404).json({message:"cannot follow yourself"});
        }

        //user who made the request
        let user1 = await User.findOne({_id:ObjectId(req.user._id)});
        console.log("User1 "+JSON.stringify(user1));

        //user whom user1 wants to follow
        let user2 = await User.findOne({_id:ObjectId(req.body.toFollowID)});
        console.log("User2 "+JSON.stringify(user2));

        //add user2 to user1's tollowing list
        user1.following.push(req.body.toFollowID);
        //add user1 to user2's followers
        user2.followers.push(req.user._id);

        //update user1 in db
        const updated_user1 = await User.findByIdAndUpdate(req.user._id,user1);
        const updated_user2 = await User.findByIdAndUpdate(user2._id,user2);

        return res.status(200).json({message:"successfully followed "+user2.username});
    }
    catch(err){
        if(err) throw err;
        console.log(err);

        return res.status(400).json({message:"internal server error"});
    }
})

//input: to unfollow userid
//todo:
//remove user2 from user1's followers list
//remove user1 from user2's following list
router.post('/unfollow', login_authorize, async (req, res) => {
    try{
        const toUnFollowID = req.body.toUnFollowID;
        
        let user1 = await User.findOne({_id:ObjectId(req.user._id)});
        let user2 = await User.findOne({_id:ObjectId(toUnFollowID)});

        const indx = user1.following.indexOf(toUnFollowID);
        const doesExist = indx>=0;
        if(doesExist){
            user1.following.splice(indx,1);
        }

        const indx1 = user2.followers.indexOf(req.user._id);
        const doesExist1 = indx1>=0;
        if(doesExist1){
            user2.followers.splice(indx1,1);
        }

        if(!doesExist){
            return res.status(404).json({message:"operation failed since you dont follow the user",status:false});
        }
        return res.status(200).json({message:"successfully unfollowed",status:true});
    }
    catch(err){
        console.log(err);

        return res.status(500).json({message:"internal server error",status:false});
    }
})

//return <username,_id> of all friends of the user
router.get("/getFriends",login_authorize,async (req,res)=>{
    const {followers,following} = await User.findById(new ObjectId(req.user._id));
    const allFriends = [...followers,...following];
    let friends = [];
    let counter = 0
    allFriends.forEach( async (f,indx,arr)=>{
        const foundUser = await User.findById(ObjectId(f._id));
        friends.push({
            username:foundUser.username,
            _id:foundUser._id
        });
        counter++;

        //this logic is used to return after asynchronously populating the array
        if(counter==arr.length){
            return res.status(200).json({friends});
        }
    })
})

//input:
//requesting user and requested username
//returns:
//statistics regarding the followers of requested user
//does the user already follow the user supplied in query parameter?
router.get("/get-user-followers-details", login_authorize, async(req, res) => {
    console.log("Username " + req.query.username);

    try{
        const user2 = await User.findOne({username:req.query.username});
        let num_followers = user2.followers.length;
        let isFollowed = user2.followers.includes(req.user._id);

        return res.status(200).json({
            num_followers,
            isFollowed
        })
    }
    catch(err){
        console.log(err);

        return res.status(500).json({messege:"internal server error"});
    }
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