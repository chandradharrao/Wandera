const CONSTS = require('./constants');
const express = require("express");
const router = express.Router()
const ObjectId = require('mongodb').ObjectId;
const loginAuth = require("../middleware/login-authorize");


// Importing the Conversation model as User
const Conversation = require("../models/conversations");
const mongoose = require('mongoose');

// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb", CONSTS.MONGO_OPTIONS);

// Since mongoose promise is depricated, override it with NodeJS promises
mongoose.Promise = global.Promise;

//get all conversations involving the user as a memeber
router.get("/conversations",loginAuth,async (req,res)=>{
    try{
        //find conversations where the members list has user as an entity
        const conversations = await Conversation.find({
            members: {
                $in: new ObjectId(req.user._id)
            }
        });
        return res.status(200).json({conversations});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"internal server error"});
    }
})

//create a new conversation(upsert)
router.post("/conversation",loginAuth,async (req,res)=>{
})


//create a new chat message under a conversation
router.post("/createChat",loginAuth,async (req,res)=>{
    try{
        const newChatMsg = new Chat({
            message:req.body.message,
            authorID:req.user._id,
            recieverID:req.body.recieverID
        });

        const savedMsg = await newChatMsg.save();
        return res.status(200).json({message:"Successfully created chat message in db",data:savedMsg});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"internal server error"});
    }
});

//get all chat messages of a user and friend pair
router.get("/getMessages",loginAuth,(req,res)=>{
    try{
        const messages = Chat.find({
            authorID:new ObjectId(req.user._id),
            recieverID:new ObjectId(req.query.recieverID)
        });
        return res.status(200).json({data:messages});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"internal server error"});
    }
})

module.exports = router;