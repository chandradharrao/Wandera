const mongoose = require('mongoose');

// Creating the 'user' schema
const userSchema = new mongoose.Schema({
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
    }
})

//Export the model so that data of userSchema type are saved in WandererCollection
const User = mongoose.model("WandererCollection", userSchema);
module.exports = User;
