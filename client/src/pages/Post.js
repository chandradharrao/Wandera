import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from '../components/NavbarProf';
import "./Post.css";


/* We get a third-party to host images and use a URL string to
reference the image in order to display it on webpages */

/* Cloudinary auxiliary data */
const CL_PRESET = "wandera";
const CL_UPLOAD_URL = "https://api.cloudinary.com/v1_1/chandracloudinarystorage123/image/upload";

const Post = () => {
    const history = useHistory();
    const [heading, setHeading] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    const [URL, setURL] = useState("");

    /* Make the post request to create post on the server only 
    when the image is successfully posted on the cloud, and the
    URL limking to the image has been set. */
    useEffect(() => {
        // useEffect will kick in also when the url is mounted initially
        if(URL) {
            fetch('/createpost', {
                method: "post",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    title: heading,
                    body: body,
                    photo: URL
                })
            })
            .then(res => {
                if (res.status === 401) {
                    alert('Please login or create an account to share your posts.');
                }
                else {
                    res.json();
                }
            })
            .then(data => {
                if(data.error) {
                    console.log(`Error! ${data.error}`);
                }
                else {
                    history.push('/account')
                }
            })
            .catch((err) => {
                console.log(`Error in routing post: ${err}`);
            });
        }
    /* This effect will kick in only 
       when the url of image is recieved */
    },[URL, body, history, heading])

    const PostAlbum = async (e) => {
        /*Upload image files using FormData */
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", CL_PRESET);

        setLoading(true);

        const options = {
            method: "POST",
            body: data
        };
        const res = await fetch(CL_UPLOAD_URL, options)
        const file = await res.json();
        console.log("File: ", file);
        setURL(file.secure_url);
        
        setLoading(false);
    };

    return (
    <div className="post-landing">
        <Navbar />
        <div className="post-page">
            <div className='post-container'>
                <h2>Create your Album</h2>
                <form className="post-form" action='#'>
                    <div className="post-input">
                        <input type="text" name='post-heading' value={heading} onChange={(e) => {setHeading(e.target.value)}} placeholder="Heading" required/>
                        <textarea rows="5" cols="10" name="post-body" maxLength="50" wrap="hard" value={body} onChange={(e) => {setBody(e.target.value)}} placeholder="Body"></textarea>
                        <div className="file-input">
                            <span>Upload Image</span>
                            <input type="file" onChange={(e) => {setImage(e.target.files[0])}} required/>
                        </div>
                        <button 
                        className="post-button" 
                        onClick={
                            (e) => {
                                e.preventDefault();
                                PostAlbum()
                        }
                        }>POST ALBUM</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
};

export default Post;