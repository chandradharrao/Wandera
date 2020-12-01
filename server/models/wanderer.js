const mongoose = require('mongoose');
const { stringify } = require('querystring');
const FollowUnfollowSchema = require('./follow-unfollow-user');

// Creating the 'user' schema
const userSchema = new mongoose.Schema({
    profile_pic:{
        type:String,
        default: "../../client/src/images/profilepic.jpg"
    },
    first_name:{
        type:String,
        required: true
    },
    last_name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    dob: {
        type:Date,
        required: true
    },
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    about_me:{
        type:String,
        default: "This user prefers to keep an air of mystery..."
    },
    followers:[{type:FollowUnfollowSchema}], // Users who follow you
    following:[{type:FollowUnfollowSchema}]  // Users you follow
})

// Export the model so that data of userSchema type is saved in WandererCollection
const User = mongoose.model("WandererCollection", userSchema);
module.exports = User;
