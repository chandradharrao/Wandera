import React from 'react';
import Navbar from '../components/NavbarProf';
import "./Post.css";

const Post = () => {
    return (
    <div className="post-landing">
        <Navbar />
        <div className="post-page">
            <div className='post-container'>
                <h2>Create your Album</h2>
                <form className="post-form" action='#'>
                    <div className="post-input">
                        <input type="text" placeholder="Title" required/>
                        <textarea rows="5" cols="10" name="post-body" maxlength="50" wrap="hard" placeholder="Body"></textarea>
                        <div className="file-input">
                            <span>Upload Image</span>
                            <input type="file" accept="image/*" required/>
                        </div>
                        <input type="submit" value="POST ALBUM" action="POST"/>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
};

export default Post;