const mongoose = require('mongoose');
const { stringify } = require('querystring');

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

// Interface for DB querying, creating and updating records
//let us export it to be used
module.exports = mongoose.model("WandererCollection", userSchema);//name of collection for storing instances of schema ie documents
