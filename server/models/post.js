const mongoose = require('mongoose');
const CommentSchema = require('./comments');
const LikeSchema = require('./like');

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,   // URL of the photo posted
        required:true
    },
    postedById:{
        /* Each user will be identified by object id,
        hence this field should be object id data type. */
        type:mongoose.Schema.Types.ObjectId, 
        /* The ID will refer to user in the "WandererCollection"
         collection.This is how we create a relationship */
        ref:"WandererCollection"
    },
    postedByUName:{
        type:String,
        required:true
    },
    // An array that contains the users who liked the particular post
    likedBy:[{type:LikeSchema}],
    comments:[{type:CommentSchema}],
    isDeleted:{
        type:Boolean,
        default:false
    }
})

// "postCollection" collection will follow PostSchema when storing the data
const Post = mongoose.model("PostCollection",PostSchema);
module.exports = Post;