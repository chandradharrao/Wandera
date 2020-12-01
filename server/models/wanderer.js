const mongoose = require('mongoose');
const { stringify } = require('querystring');
const FollowUnfollowSchema = require('./follow-unfollow-user');

// Creating the 'user' schema
const userSchema = new mongoose.Schema({
    profile_pic:{
        type:String,
        default:''//put in the default profile pic url
    },
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
<<<<<<< HEAD
    followers:[{type:FollowUnfollowSchema}], // Users who follow you
    following:[{type:FollowUnfollowSchema}]  // Users you follow
=======
    about_me:{
        type:String,
        default:"This user preferes to keep an air of mystery..."
    },
    followers:[{type:FollowUnfollowSchema}],//users who follow you
    following:[{type:FollowUnfollowSchema}]//users you follow
>>>>>>> 51291639b9b956153c88386ab2e0c245922c74d1
})

// Export the model so that data of userSchema type is saved in WandererCollection
const User = mongoose.model("WandererCollection", userSchema);
module.exports = User;
