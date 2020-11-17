const express = require('express');
const router = express.Router();
const path = require("path");

router.get('/', (req, res) => {
    res.send("<h1>Wandera HomePage</h1>");
})

router.get('/signup',(req, res) => {
    res.sendFile(path.join(__dirname, "../client", "/common/signup.html"));
});

router.post("/signup-info", (req, res) => {
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var email = req.body.email;

    if (!firstname || !lastname || !email) {
        res.json({error : "Please fill in all the details."});
    } else {
        res.json({message:"Successfully posted", 
                  'Name' : (firstname + ' ' + lastname), 
         'Email Address' : email});
    }
});

module.exports = router;