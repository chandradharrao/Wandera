const express = require('express');
const router = express.Router();
const path = require("path");
const login_authorize = require('./middleware/login_authorize');

//importing the user model as User
const Post = require('./models/post');
const mongoose = require('mongoose');

//connect to mongoose
mongoose.connect("mongodb://localhost:27017/usersdb",{ useUnifiedTopology: true, useNewUrlParser: true });

//since mongoose promise is deprecated,lets override it node js promise
mongoose.Promise = global.Promise;
//Remove depreceation warnings
mongoose.set('useFindAndModify',false);

//serve the create-a-post.html
router.get('/create-a-post',login_authorize,(req,res)=>{
    res.sendFile(path.join(__dirname, "../client", "/common/create-post.html"));
})

router.post('/createpost',login_authorize,(req,res)=>{
    console.log(req.body)
    const title = req.body.title;
    const body = req.body.body;
    console.log(`The title and body are ${req.body.title} and ${req.body.body} and the url is  ${req.body.photo}`);

    if(!title || !body){
        return res.status(422).json({error:"Please all required fields"});
    }
    console.log(`The req.user is ${req.user}`);
    Post.create({
        title:title,
        body:body,
        photo:req.body.photo,
        postedById:req.user._id,//we assigned req.users = the data found in the db while authenticating
        postedByUName:req.user.username//the username of the user who posted the photo
    }).then((savedData)=>{
        console.log("Data saved!");
        res.status(200).json({savedData:savedData});
    }).catch((err)=>{
        console.log(err);
        res.status(422).json({error:"Couldn't save post to the PosCollection in db"});
    })
})

router.get('/viewallposts',(req,res)=>{
    Post.find().then((docs)=>{
        res.status(200).json({posts:docs});
    }).catch((err)=>{
        res.status(422).json({message:"Not able to fetch all posts"});
    })
});

//get the posts posted by the users whom I follow
router.get("/viewmyfeed",login_authorize,(req,res)=>{
    //Out of all the posts,find those posts that are posted by users presents in the following array of the user loggd in
    Post.find({postedByUName:{$in:req.user.following.follow_unfollowUsername}}).then((docs)=>{//this is similar to "if 3 in [1,2,3] of python",$in matches postedBy to those fields present in req.users.folowing,this can be done with the help of a for loop too.
        res.status(200).json({posts:docs});
    }).catch((err)=>{
        res.status(422).json({message:"Not able to fetch all posts"});
    })
})

router.get('/viewmyposts',login_authorize,(req,res)=>{
    Post.find({
        postedById:req.user._id
    }).then((data)=>{
        res.status(200).json({myPost:data})
    }).catch((err)=>{
        console.log(err);
        res.status(422).json({error:"Not able to fetch your posts:<"});
    })
})


//havent tested since it will be a bit irritating to test using postman,lets test it after donf front end
router.put('/like',login_authorize,(req,res)=>{//we use put for 'updating' the likes array
    console.log(`Liked by ${req.user._id}`);
    Post.findById(req.body.post_id,(err,doc)=>{
        if(err){
            return res.status(404).json({error:err});
        }
        var isAlreadyLiked = false;
        for(var i = 0;i<doc.likedBy.length;i++){
            console.log(doc.likedBy[i].likerName);
            if(doc.likedBy[i].likerName === req.user.username){
                console.log("User already Liked");
                isAlreadyLiked = true;
            }
        }
        newLike = {
            likerID:req.user._id,
            likerName:req.user.username
        }
        if(!isAlreadyLiked){
            Post.findByIdAndUpdate(req.body.post_id,{
                $push : {likerID:req.user.id,likedBy:newLike} //we will use the set operator to modify the likes array by pushing the current user who liked the post
            },{
                new:true //return the modified record
            }).exec((err,result)=>{//execute te query
                if(err){
                    return res.status(422).json({error:err});
                }
                return res.status(200).json({result:result});
            });
        }
        else{
            return res.json({message:"Already liked!"});
        }
    });
})

router.put('/unlike',login_authorize,(req,res)=>{//we use put for 'updating' the likes array
    console.log(`We wanna remove the liker ${req.user._id} from this post ${req.body.post_id}`);
    Post.findByIdAndUpdate(req.body.post_id,{
        $pull : {likedBy:{likerName:req.user.username}} //we will use the set operator to modify the likes array by pulling the current user who liked the post
    },{
        new:true //return the modified record
    }).exec((err,result)=>{//execute te query
        if(err){
            return res.status(422).json({error:err});
        }
        return res.status(200).json({result:result});
    })
})

router.put('/comment',login_authorize,(req,res)=>{//we use put for 'updating' the likes array

    const newComment = {
        content:req.body.text,//the body of the text from the front end
        authorID:req.user._id,
        authorName:req.user.username
    }
    Post.findByIdAndUpdate(req.body.post_id,{//find the particular post and chage its comments field
        $push : {comments:newComment}
    },{
        new:true 
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        return res.status(200).json({result:result});
    })
})

router.delete('/deletepost',login_authorize,(req,res)=>{
    Post.findOne({_id:req.body.post_id}).exec((err,thepost)=>{//pass the id of the post to be deleted through the front end
        if(err || !thepost){
            return res.status(422).json({error:err});
        }
        if(thepost.postedById.toString() === req.user._id.toString() && thepost.postedByUName === req.user.username){//if the post is published by user itself then only we can delete
            thepost.remove().then((result)=>{
                res.status(200).json({
                    message:"Deleted successfully"
                });
            }).catch((err)=>{
                res.status(422).json({
                    error:err
                })
            })
        }
    })
})

module.exports = router;