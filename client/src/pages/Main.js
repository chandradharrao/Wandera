import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../App';

import Navbar from '../components/NavbarProf';
import "./Main.css";

import like_icon from "../images/red_heart.png";
import notliked_icon from "../images/heart.png";

const Main = () => {
    const [mainPosts, setmainPosts] = useState([]);

    const {state, dispatch} = useContext(UserContext);

    const my_id = JSON.parse(localStorage.getItem("user"))._id;

    useEffect(() => {
        // console.log("Viewing all posts!");
        fetch('/viewallposts', {
            headers: {
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(({posts})=> {
            // console.log(data)
            if(posts) setmainPosts(posts);

        })
     },[]);

    const like_or_unlike = ({_id,likedBy,title}) => {
        // console.log("Trying to like/unlike "+_id);
        let isAlreadyLiked = likedBy.includes(my_id);
        // console.log(`Post ${title} isAlreadyLiked? ${isAlreadyLiked}`);

        if(!isAlreadyLiked){
            fetch('/like', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    post_id: _id
                })
            })
            .then(res => res.json())
            .then(({result}) => {
                console.log("retrieved doc "+JSON.stringify(result))
                if(!result) return;

                let updated_posts = mainPosts.map(p=>{
                    if(p._id==result._id){
                        return result;
                    }
                    return p;
                });
                setmainPosts(updated_posts);
            })
            .catch(err => {
                console.log(err);
            })
        }
        else{
            fetch('/unlike', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    post_id: _id
                })
            })
            .then(res => res.json())
            .then(({result}) => {
                // console.log("Unliking post ")
                if(!result) return;
                // console.log(JSON.stringify(result))

                let updatedPosts = mainPosts.map(p=>{
                    if(p._id === result._id){
                        // console.log("Unliked Post "+JSON.stringify(result));
                        // console.log("Does user like? " + result.likedBy.includes(p._id))
                        return result;
                    }
                    return p;
                });

                setmainPosts(updatedPosts);
            })
            .catch(err => {
                console.log(err);
            })
        }
    }

    const Comment = (comment, post_id)=>{
        console.log("Sending comment: " + JSON.stringify(comment))
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
        .then(({result}) => {
            console.log(result);
            const updated_posts = mainPosts.map(item => {
              if(item._id === result._id){
                  return result;
              } else {
                  return item;
              }
           })
          setmainPosts(updated_posts)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div className="main-page">
            {console.log(mainPosts)}
            <Navbar />
            {
                /* Make a copy of the mainPosts posts array, 
                and reverse it to display newest posts first  */
                mainPosts.length>=1?[...mainPosts].sort().reverse().map((item) => {                   
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
                                    <img src={item.likedBy.includes(my_id)?like_icon:notliked_icon} alt="heart" onClick={() => like_or_unlike(item)}/>
                                    <p>{item.likedBy.length} Likes</p>
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
                }):<h3>No Posts...</h3>
            }
        </div>
    )
};

export default Main;