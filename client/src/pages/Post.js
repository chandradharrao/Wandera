import React, {useState,useEffect} from 'react';
import Navbar from '../components/NavbarProf';
import "./Post.css";
import { useHistory } from 'react-router-dom';

/* Cloudinary auxiliary data */
const CL_CLOUD_NAME = "chandracloudinarystorage123";
const CL_PRESET = "wandera";
const CL_UPLOAD_URL = "https://api.cloudinary.com/v1_1/chandracloudinarystorage123/image/upload";

const Post = () => {
    const history = useHistory();
    const [heading, setHeading] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [loading,setLoading] = useState(false);

    //we need to make the post request to create post on server only when the photo has been posted on the cloud and as a result the url has been changed.
   useEffect(()=>{
        if(image){//but the use Effect will kick in also when the url is mounted initially
            fetch('/createpost',{
                method:"post",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    title:heading,
                    body:body,
                    photo:image
                })
            }).then(res=>res.json()).then(data=>{
                if(data.error){
                    console.log("Error! ${data.error}");
                }
                else{
                    history.push('/account')
                }
            }).then(res=>alert(typeof res)).catch((err)=>{
                console.group(err)
            });
        }
    },[image])  //this effect will kick in only when the url of image is recieved

    const PostAlbum = async (e) => {
        alert(image);
        /*Upload image files using FormData */
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset","wandera");
        setLoading(true);

        const res = await fetch("https://api.cloudinary.com/v1_1/chandracloudinarystorage123/image/upload",{
            method: "POST",
            body: data
        })

        const file = await res.json();
        alert(file.secure_url);
        setImage(file.secure_url);
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
                        <textarea rows="5" cols="10" name="post-body" maxlength="50" wrap="hard" value={body} onChange={(e) => {setBody(e.target.value)}} placeholder="Body"></textarea>
                        <div className="file-input">
                            <span>Upload Image</span>
                            <input type="file" onChange={(e) => {setImage(e.target.files[0])}} required/>
                        </div>
                        <button className="post-button" onClick={(e) => {e.preventDefault();PostAlbum()}}>POST ALBUM</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    )
};

export default Post;