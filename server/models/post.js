const mongoose = require('mongoose');

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
    }
})

const Post = mongoose.model("PostCollection",PostSchema);//"postCollection" collection will follow PostSchema when storing the data
module.exports = Post;