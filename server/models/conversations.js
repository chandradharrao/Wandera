const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    //members involved in the conversation either as a sender or reciever
    members:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users",
            required:true
        }
    ]
})

//create a model to interact with collection
const conversation = mongoose.model("Conversations",conversationSchema);
//export the model for use
module.exports = conversation;