const JWT = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

// Connect to mongoose
mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
 });

// Since mongoose promise is deprecated, override it node js promise
mongoose.Promise = global.Promise;

module.exports = async (req, res, next) => {

    // The req header's authorization would contain the jwt access token
    const authHeader = req.header('Authorization');
    // console.log(`The auth head is ${authHeader}`);
    if(!authHeader){
        return res.status(401).json({error:"You must be logged in"})
    }
    const assignedToken = authHeader.split(' ')[1];//of the form Bearer 23eg#45ghk
   
    //verify if the token is indeed signed by JWT and find the corresponding user
    try{
        const {_id} = await JWT.verify(
            assignedToken,
            process.env.JWT_SECRET
        );

        const foundUser = await User.findById(_id);
        req.user = foundUser;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(400).json({message:"Internal server error!"});
    }
};