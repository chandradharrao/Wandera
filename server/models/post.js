const mongoose = require('mongoose');
const CommentSchema = require("../models/comments");

const PostSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    //A single photo
    photo: {type:String, required:true},
    postedById: {
        /* Each user will be identified by object id,
        hence this field should be object id data type. */
        type:mongoose.Schema.Types.ObjectId, 
        /* The ID will refer to user in the "Users Collection"
         collection.This is how we create a relationship */
        ref:"Users"
    },
    // An array that contains the users who liked the particular post
    likedBy:[{type:mongoose.Schema.Types.ObjectId,ref:"Users"}],
    // An array of CommentsSchema Objects
    comments:[{type:CommentSchema}]
})

// "Posts" collection will follow PostSchema when storing the data
const Post = mongoose.model("Posts",PostSchema);
module.exports = Post;