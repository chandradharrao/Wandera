const CONSTS = require('./constants');
const router = express.Router()
const ObjectId = require('mongodb').ObjectId;

// Importing the user model as User
const Chat = require('../models/chat');
const mongoose = require('mongoose');

// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb", CONSTS.MONGO_OPTIONS);

// Since mongoose promise is depricated, override it with NodeJS promises
mongoose.Promise = global.Promise;

//get all conversations of a user
router.get("/conversations",async (req,res)=>{
    try{
        const conversations = await Chat.find({
            authorID:new ObjectId(req.user._id)
        });
        return res.status(200).json({conversations});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"internal server error"});
    }
})


//create a new chat message
router.post("/createChat",async (req,res)=>{
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
router.get("/getMessages",(req,res)=>{
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