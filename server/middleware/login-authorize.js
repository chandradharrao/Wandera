const JWT = require('jsonwebtoken');
const CONSTS = require('../components/constants');
const mongoose = require('mongoose');
const User = require('../models/wanderer');

// Connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb", CONSTS.MONGO_OPTIONS);

// Since mongoose promise is deprecated, override it node js promise
mongoose.Promise = global.Promise;

/* Using the token, verify whether the logged in user 
is same as that the one who is making the request for
the resource -> the token is same as that that was assigned */

module.exports = (req, res, next) => {

    // The req header's authorization would contain the jwt access token
    const authHeader = req.header('Authorization');
    console.log(`The auth head is ${authHeader}`);
    if(!authHeader){
        return res.status(401).json({error:"You must be logged in"})
    }
    const assignedToken = authHeader.split(' ')[1];//of the form Bearer 23eg#45ghk
   
    // Check if the token is valid
    /* Token is the same as the one assigned when the 
    user logs in and we check if that user is present in the DB */
   
    JWT.verify(assignedToken,CONSTS.JWT_SECRET, (err, decodedToken) => {
        if(err) {
            res.status(401).json({error:'You must be logged in'});
        }
        // The user logged in is valid -> append details in request.user
        else {
            // ID we initially assigned while creating the token
            const _id = decodedToken._id;
            // Find the user with this ID in the data base
            User.findById(_id).then((foundData)=>{
                // Store it in the request.user
                console.log(foundData);
                // Using this the user navigates to protected resources like feed
                req.user = foundData;
                console.log(`Assigning found data to url : ${req.user}`);
                next();
            });
        }
    })
};