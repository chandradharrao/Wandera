const express = require('express');
const router = express.Router();
const path = require("path");
const login_authorize = require('../middleware/login-authorize');

// Importing the user model as User
const Thread = require('../models/discussion_threads');
const mongoose = require('mongoose');
const ThreadComment = require('../models/thread-comments');

// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb",{ useUnifiedTopology: true, useNewUrlParser: true });

// Since mongoose promise is deprecated, override it with a NodeJS promise
mongoose.Promise = global.Promise;

// Remove depreceation warnings
mongoose.set('useFindAndModify',false);

router.post("/createthread",login_authorize,(req,res)=>{
    const title = req.body.title;
    const text = req.body.text;
    const tag = req.body.tag;

    if(!tag || !text || !title){
        res.status(422).json({message:"Please fill in required fields"});
        return;
    }

    var link = '';
    if(req.body.link){
        link = req.body.link;
    }

    Thread.create({
        title:title,
        text:text,
        tag:tag,
        link:link,
        createdById:req.user._id,
        createdByUsername:req.user.username
    }).then((savedData)=>{
        console.log("Thread saved on the DB..");
        console.log(`The thread is ${savedData}`);
        return res.status(200).json({
            success:"true",
            data:savedData
        })
    }).catch((err)=>{
        console.log(err);
        return res.status(422).json({error:"Couldnt save the thread to DB.."});
    })

})

router.put("/createthreadcomment",login_authorize,(req,res)=>{
    const text = req.body.text;
    
    const aComment = {
        text:text,
        commentedById:req.user,
        commentedByUsername:req.user.username
    }

    //find the thread using the req.body.thread_id in the db and update it
    Thread.findByIdAndUpdate(req.body.thread_id,{
        $push : {comments:aComment}
    },{new:true}).exec(err,result)=>{
        if(err)
            return res.status(404).json({error:err});
        return res.status(200).json({result:result})
    }
})

module.exports = router;