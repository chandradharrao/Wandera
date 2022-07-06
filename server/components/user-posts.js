const express = require('express');
const router = express.Router();
const path = require("path");
const mongoose = require('mongoose');
const login_authorize = require('../middleware/login-authorize');
const CONSTS = require('./constants');

// Importing the user model as User
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require("../models/comments");

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

// output: Get posts of users I'm following
//input: userID of logged in user
router.get("/viewmyfeed", login_authorize, async(req, res) => {
    /* Out of all the posts, find those posts that are 
    posted by users presents in the following array of the user logged in */
   try{
        const {following} = await User.findById(req.user._id);
        const posts = await Post.find({
            postedById: {$in:following}
        });
        const isLiked = posts.likedBy.includes(req.user._id);
        return res.status(200).json({posts,isLiked});
   }
   catch(err){
        console.log(err);
        return res.status(404).json({error:"Not able to fetch all posts"})
   }
})

router.get('/viewmyposts', login_authorize, (req, res) => {
    Post.findById(req.user._id)
    .then((data) => {
        res.status(200).json({myPost:data})
    })
    .catch((err) => {
        console.log(err);
        res.status(422).json({error:"Not able to fetch the user's posts."});
    })
})

router.get('/viewpostsof/:username', login_authorize, async (req, res) => {
    try{
        const user = await User.find({username:req.params.username});
        const posts = await Post.find({
            postedById:user._id
        });
        console.log(`Posts found! All posts of this user, ${req.params.username}: \n ${data}`);
        return res.status(200).json({allPosts: data});
    }
    catch(err){
        console.log(`Error in view-posts-of router: {err}`);
        res.status(422).json({error:"Not able to fetch the user's posts."});
    }
})

//PUT method for updating the array of likerIDs
router.put('/like', login_authorize, (req, res) => {
    console.log(`Liked by ${req.user._id}`);
    Post.findById(req.body.post_id, (err, doc) => {
        if (err) {
            return res.status(404).json({error:err});
        }
        //check if post already liked
        let isAlreadyLiked = doc.likedBy.includes(req.user._id);
        if(isAlreadyLiked) return res.json({operationFailed:true,result:null,isLiked:true});

        //like the post
        Post.findByIdAndUpdate(req.body.post_id, {
            $push : {likedBy:req.user._id} //use set operator($) to push likerID
        }, {
            new: true //return the modified record
        })
        .exec((err, result) => {//execute the query
            if (err) {
                return res.status(422).json({error:err});
            }
            return res.status(200).json({result:result,operationFailed:false,isLiked:true});
        });
    });
})

router.put('/unlike',login_authorize,(req,res)=>{
    console.log(`remove the liker ${req.user._id} from this post ${req.body.post_id}`);
    Post.findByIdAndUpdate(req.body.post_id, {
        $pull : {likedBy: req.user._id}
    },{new:true})
    .exec((err, result) => {
        if(err){
            return res.status(422).json({result:null,error: err,removed:false});
        }
        return res.status(200).json({result: result,removed:true});
    })
})


router.put('/comment', login_authorize, async (req, res)=>{
    try{  
        const uPost = await Post.findByIdAndUpdate(req.body.post_id,{$push:{comments:{content: req.body.comment,
            authorID: req.user._id,authorName:req.user.username}}});
        return res.status(200).json({result:uPost});
    }
    catch(err){
        console.log(err);
        return res.status(422).json({error:err});
    }
})

router.delete('/deletepost', login_authorize, (req, res) => {
    console.log(`Request: ${req.body.post_id}`);
    Post.findOne({_id:req.body.post_id,postedById:req.user._id})
    .exec((err, thepost) => {   //pass the id of the post to be deleted through the front end
        if(err || !thepost) {
            console.log(`Error in deleting 1: ${err}`);
            console.log(`The post instead? : ${thepost}`)
            return res.status(422).json({error:err});
        }
        
        //if a post found, then must belong to the user. Hence delete it
        thepost.remove()
        .then((result) => {
            res.status(200).json({message:result});
        }).catch((err) => {
            console.log(`Error in deleting 2: ${err}`);
            res.status(422).json({error: err});
        })
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