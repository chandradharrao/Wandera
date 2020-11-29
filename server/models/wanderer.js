const mongoose = require('mongoose');

const AccountInfo = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }, 
    private : {
        type : Boolean,
        required : true
    },
    creation_date : Date,
    last_login : Date ,
    followers : Number,
    following : Number
});

const UserInfo = new mongoose.Schema({
    first_name : {
        type : String,
        required : true
    },
    last_name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    dob : {
        type : Date,
        required : true
    }
});

const AlbumText = new mongoose.Schema({
    story_text : String
});

const Album = new mongoose.Schema({
    storyline : [AlbumText]
});

const User = new mongoose.Schema({
    user_info : UserInfo,
    account_info : AccountInfo,
    user_albums : [Album],
    album_count : Number
})

mongoose.model("Wanderer", User);
