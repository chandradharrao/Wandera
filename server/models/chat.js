const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message:{
        type:String,
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

module.exports = chatSchema;