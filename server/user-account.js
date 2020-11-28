const express = require('express');
const router = express.Router();
const path = require("path");
const bcrypt = require('bcryptjs');

//importing the user model as User
const User = require('./models/wanderer');
const mongoose = require('mongoose');

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb",{ useUnifiedTopology: true, useNewUrlParser: true });

//since mongoose promise is deprecated,lets override it node js promise
mongoose.Promise = global.Promise;

router.get('/', (req, res) => {
    res.send("<h1>Wandera HomePage</h1>");
})

router.get('/signup',(req, res) => {
    res.sendFile(path.join(__dirname, "../client", "/common/signup.html"));
});

router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"../client","/common/login.html"))
});

router.post("/signup-info", (req, res) => {
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirm_password;
    var username = req.body.username;

    if (!firstname || !lastname || !email || !username) {
        res.status(422).json({error : "Please fill in all the details."});
    }
    else if(password!=confirmPassword){
        res.status(422).json({error : "Passwords Do not match."});
    } 
    else {
        //check if email already exists
        User.findOne({email:email},(err,data)=>{
            if(err){
                return res.json({error:err});
            }
            if(!data){
                console.log("No user with this email till now");

                //check if user name aleady exists
                User.findOne({username:username},(err,foundUser)=>{
                    if(err){
                        return res.json({error:err});
                    }
                    if(!foundUser){
                        console.log("No user with this username till now");
                        //hashing the password before saving
                        bcrypt.hash(password,12).then(hashedPassword=>{
                            //create the new user obj and save it simultaneously to the WandereCollection and returns a promise since its async
                            User.create({
                                email:email,
                                password:hashedPassword,
                                username:username,
                                last_name:lastname,
                                first_name:firstname
                            }).then((savedData)=>{//once its saved,the saved dayt is returned back
                                console.log("Data saved");
                                res.json({message : "saved u successfully"});
                            }).catch(err=>{
                                console.log(err);
                            });
                        }).catch(err=>{
                            console.log(err);
                        })
                    }
                    else{
                        console.log("User with this username exists!!");
                        res.json({err:'user with this username already exists'});
                    }
                })
            }
            else{
                console.log("User with this email exists!!");
                res.json({err:'user already exists'});
                //redirect to the login page
            }
        })
    }
});

router.post('/login-info',(req,res)=>{
    const uName = req.body.username;
    const password = req.body.password;

    //check if user has entered all field
    if(!uName && password){
        return res.status(422).json({error:"Enter a username"});
    }
    else if(uName && !password){
        return res.status(422).json({error:"Enter a Password"});
    }
    else if(!uName && ! password){
        return res.status(422).json({error:"Enter both Username and password"});
    }

    //if he as then create the the query obj
    const loginDetails = {
        username:uName,
        password:password
    };

    User.findOne({username:loginDetails.username}).then((foundData)=>{//this promise returns the found data
        if(!foundData){//if the found data is not empty means user already present,now we need to compare the password already in db and the password he is entering
            console.log("User with this email exists!");
            bcrypt.compare(loginDetails.password,foundData.password).then((doesMatch)=>{//this promise waits for getting the compare boolean and then executes async
                if(doesMatch){//if the passwords are the same
                    console.log("The username and password match!!");
                    res.status(200).json({message:"You can go to your home page"});
                    //redirect user to his feed or homepage
                }
                else{
                    console.log("Your username and password didnt match!");
                    return res.status(422).json({message:'Your username and password didnt match'})
                }
            }).catch((err)=>{
                console.log(err);
            })
        }
    }).catch((err)=>{
        console.log(err);
    })
})
module.exports = router;