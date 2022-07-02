const CONSTS = require('./constants');
const express = require("express");
const router = express.Router()
const ObjectId = require('mongodb').ObjectId;
const loginAuth = require("../middleware/login-authorize");


// Importing the Conversation model as User
const Conversation = require("../models/conversations");
const Chat = require("../models/chat_messege");
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
        // console.log(conversations);
        console.log(req.user._id)
        let userid = req.user._id.toString()

        let modifiedConvs = [];
        conversations.forEach(conv => {
            modifiedConvs.push({
                conversation_id:conv._id,
                other: conv.members.filter(member =>{ //return elements that pass the test
                    member = member.toString(); 
                    return member!==userid; 
                })[0]
            })
        });

        return res.status(200).json({conversations:modifiedConvs});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"internal server error"});
    }
})

//create a new conversation(upsert)
router.post("/createconversation",loginAuth,async (req,res)=>{
    try{
        let newConv = new Conversation({
            members:[req.user._id,req.body.user2_id]
        });
    
        const savedConv = await newConv.save();
    
        return res.status(200).json({message:"New Conversation created successfully!"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
})


//create a new chat message under a conversation
router.post("/createChat",loginAuth,async (req,res)=>{
    try{
        console.log("Recieved MSG");
        console.log(req.body);

        let newChatMsg = new Chat({
            conversation_id:req.body.conversation_id,
            data:req.body.data,
            authorID: new ObjectId(req.user._id),
            recieverID:new ObjectId(req.body.recieverID)
        });

        const savedMsg = await newChatMsg.save();
        return res.status(200).json({message:"Successfully created chat message in db",data:savedMsg});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"internal server error"});
    }
});

//get all chat messages of a user and friend pair using their unique conversation_id
router.post("/getMessages",loginAuth,async (req,res)=>{
    try{
        const messeges = await Chat.find({
            conversation_id:new ObjectId(req.body.conversation_id)
        });

        let data = messeges.map((m)=>{
            return {
                "created_at":ObjectId(m._id).getTimestamp(),
                _id:m._id,
                data:m.data,
                authorID:m.authorID,
                recieverID:m.recieverID,
                conversation_id:m.conversation_id
            }
        })
        return res.status(200).json({data:data});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"internal server error"});
    }
})

module.exports = router;