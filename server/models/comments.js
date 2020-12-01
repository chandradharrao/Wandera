const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    authorID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"WandererCollection",
        required:true
    },
    authorName:{
        type:String,
        required:true
    }
})

module.exports = commentSchema;