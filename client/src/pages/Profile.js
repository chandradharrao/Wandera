import React, {useState, useEffect} from 'react';
import Navbar from '../components/NavbarProf';
import "./Profile.css";

import like_icon from "../images/Like.png";
import unlike_icon from "../images/Unlike.png";
import deleteIcon from "../images/deleteIcon.png";

const Profile = () => {
    const [myPosts, setmyPosts] = useState([]);

    useEffect(() => {
        fetch('/viewmyposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => {
            setmyPosts(data.myPost);
        })
    }, []);

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
            const newLike = myPosts.map(item => {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setmyPosts(newLike)
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
            const newUnlike = myPosts.map(item => {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setmyPosts(newUnlike)
        })
        .catch(err => {
            console.log(err);
        })
    }

    const Delete = async (post_id) => {
        const res = await fetch(`/deletepost`, {
            method: "delete",
            headers: {
                'Content-Type': 'application/json',
                Authorization:"Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                post_id: post_id
            })
        });
        const file = await res.json();
        const status = res.status;

        if (status === 422) {
            console.log(`Error in deleting post: ${file.error}`);
        } else {
            console.log('Delete albums response file: ', file.message);
            const toDelete = myPosts.filter(item=>{
                return item._id !== file.message._id
            })
            setmyPosts(toDelete);
        }
    }

    const checkEmpty = () => {
        if (myPosts.length === 0) {
            return (
                <div className="no-post-container">
                    <div className="no-posts">  
                        No posts. Create an album now to share with the world!
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
                myPosts.slice(0).reverse().map(item => {
                    return (
                        <div className="profile-container" key={item._id}>
                            <div className="profile-post-container">
                                <img src={item.photo} alt="User" className="user-profile-image" />
                                <div className="profile-icons">
                                    <img src={like_icon} alt="Like" onClick={() => Like(item._id)} />
                                    <img src={unlike_icon} alt="Unlike" onClick={() => Unlike(item._id)}/>
                                    <p>{item.likedBy.length} Likes</p>
                                    <img src={deleteIcon} alt="Delete Post" onClick={() => Delete(item._id)} className="delete-logo"/>
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