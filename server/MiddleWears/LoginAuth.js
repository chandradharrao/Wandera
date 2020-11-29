const JWT = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants');
const CONSTS = require('../constants');
const mongoose = require('mongoose');
const User = require('../models/wanderer');

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb",{ useUnifiedTopology: true, useNewUrlParser: true });

//since mongoose promise is deprecated,lets override it node js promise
mongoose.Promise = global.Promise;

//verify the token wheather the logged in user is same as that the one who is making the request for the resource ie wheather its the same token we gave
module.exports = (req,res,next)=>{
    //the req header's authorization would contain the jwt access token
    const authHeader = req.header('Authorization');
    console.log(`The auth head is ${authHeader}`);
    if(!authHeader){
        req.status(401).json({error:"You must be logged in"})
    }
    const assignedToken = authHeader.split(' ')[1];//of the form Bearer 23eg#45ghk
    //check if the token is valid
    JWT.verify(assignedToken,JWT_SECRET,(err,decodedToken)=>{//assigned token is the token assignd when the user logs in and we check if that user is present in the db
        if(err){
            res.status(401).json({error:'You must be logged in'});
        }
        else{//hence there is a valid user logged in therefore we put his details in the request.user
            const _id = decodedToken._id;//this is the id we initially assigned while creating the token
            //lets find the user with this id in the data base
            User.findById(_id).then((foundData)=>{
                //store it in the request.user
                console.log(foundData);
                req.user = foundData;//now using this he can navigate to his protected resources like feed
                next();
            });
        }
    })
}