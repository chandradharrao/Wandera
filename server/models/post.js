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
        type:String,
        required:true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,//each user will be identified by obect id,hence this field should be object id data type
        ref:"WandererCollection" //the id will refer to user in the "WandererCollection" collection.This is how we create a relationship
    }
})

const Post = mongoose.model("PostCollection",PostSchema);//"postCollection" collection will follow PostSchema when storing the data
module.exports = Post;