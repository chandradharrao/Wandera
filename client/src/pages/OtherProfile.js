import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import Navbar from '../components/NavbarProf';
import "./Profile.css";

import like_icon from "../images/Like.png";
import unlike_icon from "../images/Unlike.png";


const Profile = () => {
    const [allPosts, setallPosts] = useState([]);

    const {username} = useParams();

    useEffect(() => {
        fetch(`/viewpostsof/${username}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => {
            setallPosts(data.allPosts);
        })
        .catch(err => {
            console.log(err);
        })
    }, [username]);

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
            const newLike = allPosts.map(item => {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setallPosts(newLike)
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
            const newUnlike = allPosts.map(item => {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setallPosts(newUnlike)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const checkEmpty = () => {
        if (allPosts.length === 0) {
            return (
                <div className="no-post-container">
                    <div className="no-posts">  
                        The user doesn't have any posts to share at the moment.
                    </div>
                </div>
            )
        };
    }

    return (
        <div className="profile-page">
            <Navbar />
            {
                checkEmpty()
            }
            {
                /* Make a copy of the profilePosts posts array, 
                and reverse it to display newest posts first  */
                allPosts.slice(0).reverse().map(item => {
                    return (
                        <div className="profile-container" key={item._id}>
                            <div className="profile-post-container">
                                <img src={item.photo} alt="User" className="user-profile-image" />
                                <div className="profile-icons">
                                    <img src={like_icon} alt="Like" onClick={() => Like(item._id)} />
                                    <img src={unlike_icon} alt="Unlike" onClick={() => Unlike(item._id)}/>
                                    <p>{item.likedBy.length} Likes</p>
                                </div>
                                <div className="profile-post-content">
                                    <h3>{item.title}</h3>
                                    <p>{item.body}</p>
                                    <h4>Comments</h4>
                                    <div className="profile-comment-section">
                                        {
                                            item.comments.map(comment => {
                                                return(
                                                <div className="profile-comments" key={comment._id}>
                                                    <span className="profile-comment-author">
                                                        {comment.authorName}
                                                    </span><br/>
                                                    <p>{comment.content}</p>
                                                </div>
                                                )
                                            })
                                        }
                                    </div>
                                    <form className="profile-post-comment"> 
                                        <input type="text" className="profile-comment-text" placeholder="Reply to comments on your story!" />  
                                        <input type="button" value="Post comment" onClick={(e) => {
                                            e.preventDefault();
                                            Comment(document.forms[0].comment_text.value, item._id)
                                        }}/>
                                    </form>
                                </div>
                            </div>
                        </div>                    
                    )
                })
            }
        </div>
    )
};

export default Profile;