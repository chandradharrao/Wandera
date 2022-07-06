//this is just the schema. We are storing the comments in  a comments collection.
//rather we are storing it in the user's Post collection iteself.

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