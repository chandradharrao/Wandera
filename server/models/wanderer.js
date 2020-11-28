const mongoose = require('mongoose');

// Creating the 'user' schema
const user = new mongoose.Schema({
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
    }
})

// Interface for DB querying, creating and updating records
mongoose.model("Wanderer", user);
