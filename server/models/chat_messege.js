const mongoose = require('mongoose');

//a conversation consists of multiple chat messeges
//there is only one unique entry for every pair of users chatting
//Eg: user1 can send multiple messages to user2, but only one entry in conversation table for the pair user1,user2
const chatMessegeSchema = new mongoose.Schema({
    data:{
        type:String,
        required:true
    },
    conversation_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversations",
        required:true
    },
    authorID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    recieverID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    }
});

//create a model to interact with a collection
const ChatMessege = mongoose.model("ChatMessages", chatMessegeSchema);
//export the model for use
module.exports = ChatMessege;