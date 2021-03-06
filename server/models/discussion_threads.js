const mongoose = require('mongoose');
const ThreadCommentSchema = require('./thread-comments');

const ThreadSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    link:{
        type:String //attachments like rference to other websites
    },
    createdById:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"WandererCollection"
    },
    createdByUsername:{
        type:String,
        required:true
    },
    comments:[{type:ThreadCommentSchema}],
    votes:{
        type:Number,
        default:0
    }
})

const Thread = mongoose.model("ThreadCollection",ThreadSchema);
module.exports = Thread;