const mongoose = require('mongoose');

const ThreadCommentSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    commentedById:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"WandererCollection"
    },
    commentedByUsername:{
        type:String,
        required:true
    }
})

module.exports = ThreadCommentSchema;