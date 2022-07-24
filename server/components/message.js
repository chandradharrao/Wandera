require('dotenv').config();
const express = require("express");
const router = express.Router()
const ObjectId = require('mongodb').ObjectId;
const loginAuth = require("../middleware/login-authorize");


// Importing the Conversation model as User
const Conversation = require("../models/conversations");
const Chat = require("../models/chat_messege");
const mongoose = require('mongoose');
const User = require("../models/user");

// Connect to mongoose
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
 });

// Since mongoose promise is depricated, override it with NodeJS promises
mongoose.Promise = global.Promise;


const getUserByName = async (userid)=>{
    try{
        console.log("Searching for " + userid);
        const otherUser = await User.findById(new ObjectId(userid));
        console.log(otherUser);
        const name = otherUser.first_name + " " + otherUser.last_name;
        console.log("Name: " + name)
        return name;
       }
       catch(err){
        console.log(err);
        return null;
       }
}


//get all conversations involving the user as a memeber
router.get("/conversations",loginAuth,async (req,res)=>{
    // console.log("/conversations api called!");

    try{
        //find conversations where the members list has user as an entity
        const all_test = await Conversation.find();
        if(all_test.length)
            console.log(`All conv ${all_test} in the db`);
        else
            console.log("Empty db :(")
        
        const conversations = await Conversation.find({
            members: {
                $in: req.user._id.toString()
            }
        });
        if(conversations.length)
            console.log(`Conversations retrived ${conversations} with members ${[req.user._id.toString()]}`);
        else
            console.log("No conversations yet :(");

        // console.log(`Number of conversations retrieved ${conversations.length}`)
        // console.log("----------------")
        // console.log(req.user._id);
        let userid = req.user._id.toString()

        let modifiedConvs = [];
        let counter = 0;
        conversations.forEach((conv,indx,arr) => {
            // console.log(`A conv ${conv}`);

            let other = conv.members.filter(member =>{ //return elements that pass the test
                member = member.toString(); 
                return member && member!==userid; 
            })[0];

            if(!other){ counter++; return; }

            getUserByName(other).then(name=>{
                modifiedConvs.push({
                    conversation_id:conv._id,
                    other,
                    otherName: name
                })
                counter++;

                if(counter === arr.length){
                    // console.log(`Conversations: ${modifiedConvs}`);
                    return res.status(200).json({conversations:modifiedConvs});
                }
            }).catch(err=>{
                // console.log(err);
                if(err) throw err;
            })
        });
    }
    catch(err){
        // console.log(err);
        return res.status(500).json({message:"internal server error"});
    }
})

//create a new conversation(upsert)
router.post("/createConversation",loginAuth,async (req,res)=>{
    try{
        console.log("Creating a conversation between "+req.user._id+" "+req.body.user2_id);
        //check if a conversation involving the requested memebrs already exists
        let foundConv = Conversation.find({$or:[
            {members:[req.user._id,req.body.user2_id]},
            {members:[req.body.user2_id,req.user._id]}
        ]});

        if(foundConv){
            console.log("A conversation already exists :(");
            
            // Conversation.remove({},(err)=>{
            //     if(err) console.log(err)
            //     else console.log("Removed everything..")

            //     return res.status(409).json({status:true,message:"Conversation already exists, use that"});
            // })

            return res.status(409).json({status:true,message:"Conversation already exists, use that"});
        }
        
        // const _ = await newConv.save();
        const newConv = await Conversation.create({
            members:[req.user._id,req.body.user2_id]
        });
        console.log(`New conversation created is: ${newConv}`);

        return res.status(200).json({status:true,messege:"New Conversation created successfully!"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({status:false,messege:"Internal server error"});
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