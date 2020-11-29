const mongoose = require('mongoose');

const Follow_UnfollowSchema = new mongoose.Schema({
    follow_unfollowID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"WandererCollection"
    },
    follow_unfollowUsername:{
        type:String,
        required:true
    },
})

module.exports = Follow_UnfollowSchema;