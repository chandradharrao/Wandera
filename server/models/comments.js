const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    authorID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"WandererCollection",
        required:true
    },
    likes:{
        type:Number,
        default:0,
        required:false
    }
});

//replies are also of type comments
commentSchema.add({
    replies:[
        {type:commentSchema}
    ]
})

module.exports = commentSchema;