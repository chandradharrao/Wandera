const mongoose = require('mongoose');

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
})

userSchema.add({ followers:[
    {type:mongoose.Schema.Types.ObjectID,ref:"Users"}
] }) // Users who follow you

userSchema.add({ following: [
    {type:mongoose.Schema.Types.ObjectID,
    ref:"Users"}
] }) // Users you follow

// Export the model so that a row of userSchema type can be saved in Users collection
const User = mongoose.model("Users", userSchema);
module.exports = User;
