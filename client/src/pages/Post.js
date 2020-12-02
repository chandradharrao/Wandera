import React, {useState} from 'react';
import Navbar from '../components/NavbarProf';
import "./Post.css";

/* Cloudinary auxiliary data */
const CL_CLOUD_NAME = "histor1an0";
const CL_PRESET = "wandera";
const CL_UPLOAD_URL = "https://api.cloudinary.com/v1_1/histor1an0/image/upload";

const Post = () => {
    const [heading, setHeading] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");

    const PostAlbum = () => {
        /* Upload image files */
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CL_PRESET);
        formData.append("cloud_name", CL_CLOUD_NAME);
        fetch(CL_UPLOAD_URL, {
            method: "post",
            body: formData
        })
        .then(res => res.json())
        .then(formData => {
            console.log(formData)
        }).catch(err => {
            console.log(err);
        })
    }

    return (
    <div className="post-landing">
        <Navbar />
        <div className="post-page">
            <div className='post-container'>
                <h2>Create your Album</h2>
                <form className="post-form" action='#'>
                    <div className="post-input">
                        <input type="text" name='post-heading' value={heading} onChange={(e) => {setHeading(e.target.value)}} placeholder="Heading" required/>
                        <textarea rows="5" cols="10" name="post-body" maxlength="50" wrap="hard" value={body} onChange={(e) => {setBody(e.target.value)}} placeholder="Body"></textarea>
                        <div className="file-input">
                            <span>Upload Image</span>
                            <input type="file" accept="image/*" onChange={(e) => {setImage(e.target.files[0])}} required/>
                        </div>
                        <button className="post-button" onClick={() => PostAlbum()}>POST ALBUM</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
};

export default Post;