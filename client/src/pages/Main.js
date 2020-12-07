import React, {useState, useEffect} from 'react';
import Navbar from '../components/NavbarProf';
import "./Main.css";

import like_icon from "../images/Like.png";
import unlike_icon from "../images/Unlike.png";

const Main = () => {
    const [mainPosts, setmainPosts] = useState([]);

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
                                <p>{item.postedByUName}</p>
                            </div>
                            <img src={item.photo} alt="User" className="user-main-image" />
                            <div className="main-icons">
                                <img src={like_icon} alt="Like" onClick={() => Like(item._id)} />
                                <img src={unlike_icon} alt="Unlike" onClick={() => Unlike(item._id)}/>
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
            })
        }
    </div>
    )
};

export default Main;