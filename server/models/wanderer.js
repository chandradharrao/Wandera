const mongoose = require('mongoose');

const user = new mongoose.Schema({//creating the user schema
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

mongoose.model("Wanderer",user);//interface for db querying,creating and updating records
