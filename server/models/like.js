const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    likerID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    }
})

module.exports = likeSchema;