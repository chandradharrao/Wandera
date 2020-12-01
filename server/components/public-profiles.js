const express = require('express');
const router = express.Router();
const path = require("path");

//importing the user model as User
const User = require('./models/wanderer');
const Post = require('./models/post');
const mongoose = require('mongoose');

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb",{ useUnifiedTopology: true, useNewUrlParser: true });

//since mongoose promise is deprecated,lets override it node js promise
mongoose.Promise = global.Promise;
//Remove depreceation warnings
mongoose.set('useFindAndModify',false);

router.post('/viewprofile',(req,res)=>{//click on the icon in the front end
    //find the user recieved from the front end n the user db
    User.findOne({username:req.body.username}).then((foundUser)=>{
        //if user foundd fetch all the posts of the user from backend and send to the front end
        Post.find({postedByID:foundUser._id,postedByUName:foundUser.username}).exec((err,postsFound)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.status(200).json({postedBy:foundUser,posts:postsFound});
        })
    }).catch((err)=>{
        console.log(err);
        return res.status(404).json({error:"User not found"});
    })
})

module.exports = router;