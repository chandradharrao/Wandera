const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

/* Import the user model as User */
const User = require("../models/user");
const login_authorize = require('../middleware/login-authorize');
const CONSTS = require('./constants');
const { ObjectId } = require('mongodb');
const { json } = require('body-parser');

/* Connect to mongoose, override depracated
 Promise with the global one */

mongoose.connect("mongodb://localhost:27017/usersdb", CONSTS.MONGO_OPTIONS);
mongoose.Promise = global.Promise;

/* Router for accessing protected resources like the main feed */
/* Requests pass through the middleware via this route */

router.get('/protected', login_authorize, (req, res) => {
    res.json({message: "Welcom back! This is your home page!"});
});

router.get("/allusers",(req,res)=>{
    User.find({},(err,users)=>{
        return res.json({users})
    })
})

const createAccount = async (firstname,lastname,email,dob,username,password) => {   
    const user_by_email = await User.findOne({email});
    const user_by_password = await User.findOne({username});

    if (!user_by_email && !user_by_password){
        const hashedPassword = bcrypt.hashSync(password,12);
        const aUser = await User.create({
            dob:dob,
            email:email,
            password:hashedPassword,
            username:username,
            last_name:lastname,
            first_name:firstname
        });
        return aUser;
    }
    else{
        return null;
    }
}

router.post("/signup", (req, res) => {
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const {username,email,dob,password} = req.body;
    console.log(firstname+" "+lastname+" "+email+" "+dob+" "+username+" "+password)

    if (!firstname || !lastname || !email || !username) {
        res.status(404).json({error : "Please fill in all the details."});
    } 
    else {
        createAccount(firstname,lastname,email,dob,username,password)
            .then((aUser)=>{
                if(aUser==null){
                    return res.status(400).json({message:"User with same email or username already found!"});
                }
                return res.status(200).json({message:aUser});
            })
            .catch(err=>{
                console.log(err);
                res.status(400).json({error:err});
            })
    }     
});

const signin = async (username,password)=>{
    const foundUser = await User.findOne({username});
    if(foundUser){
        const doesMatch = bcrypt.compareSync(password,foundUser.password);
        if(doesMatch){
            //hash the _id attribute since its guarenteed to be unique
            const token = JWT.sign({_id:foundUser._id},CONSTS.JWT_SECRET);
            return {token,user:foundUser};
        }
        return {token:null,user:null,message:"username and/or password doesnt match!"};
    }
    return {token:null,user:null,message:"Please create new account before signing in!"};
}

router.post('/login', (req, res) => {
    const {username,password} = req.body;

    // Check if the user has entered all given fields
    if (!username && password){
        return res.status(422).json({error:"Enter the username."});
    } else if (username && !password){
        return res.status(422).json({error:"Enter the password."});
    } else if (!username && !password){
        return res.status(422).json({error:"Enter both the username and password."});
    }

    signin(username,password)
        .then(({token,user,message})=>{
            if(!token || !user){
                return res.status(422).json({message});
            }

            return res.json({token,user:{name: user.first_name + ' ' + user.last_name,
            email: user.email,
            _id: user._id,
            followers: user.followers,
            following: user.following,
            username: user.username,
            pic: user.profile_pic}})
        })
        .catch(err=>{
            console.log(err);
            return res.status(400).json({message:"internal server error!"});
        })
});

router.put('/updatepic', login_authorize, (req,res)=>{
    User.findByIdAndUpdate(req.user._id,
        {$set: {profile_pic: req.body.photo}}, {new:true},
        (err,result) => {
         if(err) {
             return res.status(422).json({error:"Profile picture could not be posted."})
         }
         res.json(result)
    })
})

router.post('/logout',(req,res)=>{
    //remove the user attribute we had set earlier
    req.user = '';
    if(!req.user){
        return res.status(200).json({message:"You have been logged out!"});
    }
    return res.status(422).json({error:"Not able to log out"});
});

module.exports = router;