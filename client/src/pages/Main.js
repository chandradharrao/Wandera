import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../App';

import Navbar from '../components/NavbarProf';
import "./Main.css";

import like_icon from "../images/red_heart.png";
import notliked_icon from "../images/heart.png";
const heartIcons = {like_icon,notliked_icon}

const Main = () => {
    const [mainPosts, setmainPosts] = useState([]);

    const {state, dispatch} = useContext(UserContext);

    const [heart, setheart] = useState(heartIcons.notliked_icon)

    useEffect(() => {
        fetch('/viewallposts', {
            headers: {
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => {
            setmainPosts(data.posts);
        })
     });

     useEffect(() => {
         console.log("Changed img src..")
     }, [heart])

    const Like = (post_id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                post_id: post_id
            })
        })
        .then(res => res.json())
        .then(result => {
            const newLike = mainPosts.map(item => {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setmainPosts(newLike)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const Unlike = (post_id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                post_id: post_id
            })
        })
        .then(res => res.json())
        .then(result => {
            const newUnlike = mainPosts.map(item => {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setmainPosts(newUnlike)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const clickLikeButton = (post_id)=>{
        Promise.resolve().then(()=>{
            if(heart === heartIcons.like_icon){
                console.log("unliking...")
                setheart(heart=> heart = heartIcons.notliked_icon);
                Unlike(post_id);
            }
            else{
                console.log("liking...");
                setheart(heart=> heart =heartIcons.like_icon);
                Like(post_id);
            }
        })
    }

    const Comment = (comment, post_id)=>{
        fetch('/comment',{
            method: "put",
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                post_id,
                comment
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            const newComment = mainPosts.map(item => {
              if(item._id === result._id){
                  return result
              } else {
                  return item
              }
           })
          setmainPosts(newComment)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div className="main-page">
            <Navbar />
            {
                /* Make a copy of the mainPosts posts array, 
                and reverse it to display newest posts first  */
                mainPosts.slice(0).reverse().map(item => {
                    return (
                        <div className="main-container" key={item._id}>
                            <div className="main-post-container">
                                <div className="user-main-info">
                                { 
                                    (item.postedByUName === (state ? JSON.parse(state).username : console.log("State is null"))) ?
                                    <a href={`/account`}>
                                        <p>{item.postedByUName}</p>
                                    </a>
                                    : 
                                    <a href={`/account/${item.postedByUName}`}>
                                        <p>{item.postedByUName}</p>
                                    </a>
                                }
                                </div>
                                <img src={item.photo} alt="User" className="user-main-image" />
                                <div className="main-icons">
                                    <img src={heart} alt="heart" onClick={() => clickLikeButton(item._id)}/>
                                    <p>{item.likedBy.length}</p>
                                </div>
                                <div className="main-post-content">
                                    <h3>{item.title}</h3>
                                    <p>{item.body}</p>
                                    <h4>Comments</h4>
                                    <div className="comment-section">
                                        {
                                            item.comments.map(comment => {
                                                return(
                                                <div className="comments" key={comment._id}>
                                                    <span className="comment-author">
                                                        {comment.authorName}
                                                    </span><br/>
                                                    <p>{comment.content}</p>
                                                </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <form id="post-comment">
                                        
                                        <input type="text" id="comment_text" placeholder="Comment on this story!" />  
                                        <input type="button" value="Post comment" onClick={(e) => {
                                            e.preventDefault();
                                            Comment(document.forms[0].comment_text.value, item._id)
                                        }}/>
                                    </form>
                                </div>
                            </div>
                        </div>                    
                    );
                })
            }
        </div>
    )
};

export default Main;