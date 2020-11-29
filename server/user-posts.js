const express = require('express');
const router = express.Router();
const path = require("path");
const mongoose = require('mongoose');

router.post('/publishpost',(req,res)=>{
    const title = req.title;
    const body = req.body;

    if(!title || !body){
        return res.status(422).json({error:"Please all required fields"});
    }
})