const express = require('express');
const router = express.Router();
const path = require("path");
const mongoose = require('mongoose');
const login_authorize = require('../middleware/login-authorize');
const CONSTS = require('./constants');

// Importing the user model as User
const Post = require('../models/post');
const User = require('../models/wanderer');

// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb", CONSTS.MONGO_OPTIONS);

// Since mongoose promise is deprecated, override it with a NodeJS promise
mongoose.Promise = global.Promise;

// Remove deprication warnings
mongoose.set('useFindAndModify',false);

router.post('/createpost', login_authorize, (req, res) => {
    console.log("Request for creating a post received.");
    const title = req.body.title;
    const body = req.body.body;
    console.log(`The title and body are ${req.body.title} and ${req.body.body}. 
    The URL of the picture is  ${req.body.photo}`);

    if(!title || !body || !req.body.photo) {
        return res.status(404).json({error:"Please enter all required fields."});
    }
    console.log(`The req.user is ${req.user}`);
    Post.create({
        title:title,
        body:body,
        photo:req.body.photo,

        /* We assigned req.users or the data 
        found in the DB while authenticating */
        postedById:req.user._id,

        /* The username of the user who posted the photo */
        postedByUName:req.user.username
    })
    .then((savedData) => {
        console.log("Saved Data", savedData)
        console.log("Data saved!");
        res.status(200).json({savedData:savedData});
    })
    .catch((err) => {
        console.log(err);
        res.status(422).json({error:"Couldn't save the post to the PostCollection in the DB."});
    })
})

router.get('/viewallposts', (req, res) => {
    Post.find()
    .then((docs) => {
        res.status(200).json({posts:docs});
    })
    .catch((err) => {
        res.status(422).json({message:"Not able to fetch all posts"});
    })
});

// Get posts of users I'm following
router.get("/viewmyfeed", login_authorize, (req, res) => {
    /* Out of all the posts, find those posts that are 
    posted by users presents in the following array of the user logged in */
    Post.find({
        postedByUName: {$in:req.user.following.follow_unfollowUsername}
    })

    /* Similar to "if 3 in [1,2,3] of python" -> 
    $in matches postedBy to those fields present 
    in req.users.following, this can be done with
    the help of a for loop too. */
    
    .then((docs) => {
        res.status(200).json({posts:docs});
    })
    .catch((err) => {
        res.status(404).json({error: "Not able to fetch all posts"});
    })
})

router.get('/viewmyposts', login_authorize, (req, res) => {
    Post.find({
        postedById:req.user._id
    })
    .then((data) => {
        res.status(200).json({myPost:data})
    })
    .catch((err) => {
        console.log(err);
        res.status(422).json({error:"Not able to fetch the user's posts."});
    })
})

router.get('/viewpostsof/:username', login_authorize, (req, res) => {
    Post.find({
        postedByUName: req.params.username
    })
    .then((data) => {
        console.log(`Posts found! All posts of this user, ${req.params.username}: \n ${data}`);
        res.status(200).json({allPosts: data})
    })
    .catch((err) => {
        console.log(`Error in view-posts-of router: {err}`);
        res.status(422).json({error:"Not able to fetch the user's posts."});
    })
})

//havent tested since it will be a bit irritating to test using postman,lets test it after donf front end
router.put('/like', login_authorize, (req, res) => {//we use put for 'updating' the likes array
    console.log(`Liked by ${req.user._id}`);
    Post.findById(req.body.post_id, (err, doc) => {
        if (err) {
            return res.status(404).json({error:err});
        }
        var isAlreadyLiked = false;
        for(var i = 0; i < doc.likedBy.length; i++) {
            console.log(doc.likedBy[i].likerName);
            if(doc.likedBy[i].likerName === req.user.username){
                console.log("User already Liked");
                isAlreadyLiked = true;
            }
        }
        newLike = {
            likerID:req.user._id,
            likerName:req.user.username
        }
        if(!isAlreadyLiked){
            Post.findByIdAndUpdate(req.body.post_id, {
                $push : {likerID:req.user.id, likedBy:newLike} //we will use the set operator to modify the likes array by pushing the current user who liked the post
            }, {
                new: true //return the modified record
            })
            .exec((err, result) => {//execute the query
                if (err) {
                    return res.status(422).json({error:err});
                }
                return res.status(200).json({result:result});
            });
        } else {
            return res.json({message: "Already liked!"});
        }
    });
})

router.put('/unlike',login_authorize,(req,res)=>{//we use put for 'updating' the likes array
    console.log(`We wanna remove the liker ${req.user._id} from this post ${req.body.post_id}`);
    Post.findByIdAndUpdate(req.body.post_id, {
        $pull : {likedBy: {likerName:req.user.username}} //we will use the set operator to modify the likes array by pulling the current user who liked the post
    },{
        new:true //return the modified record
    }).exec((err, result) => {//execute te query
        if(err){
            return res.status(422).json({error: err});
        }
        return res.status(200).json({result: result});
    })
})

router.put('/comment', login_authorize, (req, res)=>{//we use put for 'updating' the likes array

    const newComment = {
        content: req.body.comment,//the body of the text from the front end
        authorID: req.user._id,
        authorName: req.user.username
    }
    console.log('User: ', req.user);
    Post.findByIdAndUpdate(req.body.post_id, {//find the particular post and chage its comments field
        $push : {comments:newComment}
    }, {
        new:true 
    })
    .exec((err, result) => {
        if(err) {
            return res.status(422).json({error:err});
        }
        return res.status(200).json({result:result});
    })
})

router.delete('/deletepost', login_authorize, (req, res) => {
    console.log(`Request: ${req.body.post_id}`);
    Post.findOne({_id:req.body.post_id})
    .exec((err, thepost) => {   //pass the id of the post to be deleted through the front end
        if(err || !thepost) {
            console.log(`Error in deleting 1: ${err}`);
            console.log(`The post instead? : ${thepost}`)
            return res.status(422).json({error:err});
        }
        if(thepost.postedById.toString() === req.user._id.toString() && thepost.postedByUName === req.user.username){//if the post is published by user itself then only we can delete
            thepost.remove()
            .then((result) => {
                res.status(200).json({message:result});
            }).catch((err) => {
                console.log(`Error in deleting 2: ${err}`);
                res.status(422).json({error: err});
            })
        }
    })
})

router.post('/searchusers',(req,res)=>{
    let usersRegEx = new RegExp("^"+req.body.query);
    User.find({username:{$regex:usersRegEx}}).then((foundData)=>{
        res.status(200).json({users:foundData});
    }).catch((err)=>{
        res.status(422).json({error:err});
    })
})

module.exports = router;