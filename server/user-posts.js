const express = require('express');
const router = express.Router();
const path = require("path");
const LoginAuth = require('./MiddleWears/LoginAuth');

//importing the user model as User
const Post = require('./models/post');
const mongoose = require('mongoose');

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb",{ useUnifiedTopology: true, useNewUrlParser: true });

//since mongoose promise is deprecated,lets override it node js promise
mongoose.Promise = global.Promise;

//serve the create-a-post.html
router.get('/create-a-post',LoginAuth,(req,res)=>{
    res.sendFile(path.join(__dirname, "../client", "/common/create-post.html"));
})

router.post('/createpost',LoginAuth,(req,res)=>{
    console.log(req.body)
    const title = req.body.title;
    const body = req.body.body;
    console.log(`The title and body are ${req.body.title} and ${req.body.body} and the url is  ${req.body.photo}`);

    if(!title || !body){
        return res.status(422).json({error:"Please all required fields"});
    }
    console.log(`The req.user is ${req.user}`);
    Post.create({
        title:title,
        body:body,
        photo:req.body.photo,
        postedById:req.user._id,//we assigned req.users = the data found in the db while authenticating
        postedByUName:req.user.username//the username of the user who posted the photo
    }).then((savedData)=>{
        console.log("Data saved!");
        res.status(200).json({savedData:savedData});
    }).catch((err)=>{
        console.log(err);
        res.status(422).json({error:"Couldn't save post to the PosCollection in db"});
    })
})

router.get('/viewallposts',(req,res)=>{
    Post.find().then((docs)=>{
        res.status(200).json({posts:docs});
    }).catch((err)=>{
        res.status(422).json({message:"Not able to fetch all posts"});
    })
})

router.get('/viewmyposts',LoginAuth,(req,res)=>{
    Post.find({
        postedById:req.user._id
    }).then((data)=>{
        res.status(200).json({myPost:data})
    }).catch((err)=>{
        console.log(err);
        res.status(422).json({error:"Not able to fetch your posts:<"});
    })
})

module.exports = router;