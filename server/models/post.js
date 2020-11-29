const mongoose = require('mongoose');
const CommentSchema = require('./comments');
const LikeSchema = require('./like')

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
        type:String,//url of the photo posted
        required:true
    },
    postedById:{
        type:mongoose.Schema.Types.ObjectId,//each user will be identified by object id,hence this field should be object id data type.
        ref:"WandererCollection" //the id will refer to user in the "WandererCollection" collection.This is how we create a relationship
    },
    postedByUName:{
        type:String,
        required:true
    },
    likedBy:[{type:LikeSchema}],//an array that contains the users who liked the particular post
    comments:[{type:CommentSchema}]
})

const Post = mongoose.model("PostCollection",PostSchema);//"postCollection" collection will follow PostSchema when storing the data
module.exports = Post;