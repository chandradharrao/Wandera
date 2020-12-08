import React, {useState, useContext, useEffect} from 'react';
import {UserContext} from "../App";
import "./About.css";
import ProfilePic from "../images/profilepic.jpg";

const CL_PRESET = "wandera";
const CL_UPLOAD_URL = "https://api.cloudinary.com/v1_1/chandracloudinarystorage123/image/upload";


const About = () => {
    const {state, dispatch} = useContext(UserContext);

    const [URL, setURL] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false)

    useEffect(() => {
        // useEffect will kick in also when the url is mounted initially
        if(URL) {
            fetch('/updatepic', {
                method: "put",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    photo: URL
                })
            })
            .then(res => res.json())
            .then(data => {
                const user = JSON.parse(localStorage.getItem("user"));
                console.log(data, "\n", user);
                user.pic = data.profile_pic;
                localStorage.setItem("user", JSON.stringify(user));
                dispatch({type: "UPDATEPIC", payload: data.profile_pic});
                // const later = JSON.parse(localStorage.getItem("user"))
                // console.log(`Final : ${later}`);
            })
            .catch((err) => {
                console.log(`Error in changing profile picture: ${err}`);
            })
        }
    /* This effect will kick in only 
       when the url of image is recieved */
    }, [URL, dispatch, state])

    const changePic = async (e) => {
        /* Upload image files using FormData */
        const data = new FormData();
        console.log(image)
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
    }

    const Search = () => {
        return (
            <div className="search">
                <button className="profile-pic-btn"
                    onClick={(e) => {
                        e.preventDefault(); 
                        setShowResults(true);
                    }}>Update Profile Picture</button>
                { 
                    showResults ? <Results /> : null 
                }
            </div>
        )
    }
      
    const Results = () => {
        return (
        <div className="results">
            <span>Upload Image</span>
            <input type="file" onChange={(e) => {
                setImage(e.target.files[0]);
                console.log(e.target.files[0]);
            }} required/>
             <button className="profile-pic-btn"
                    onClick={(e) => {
                        e.preventDefault(); 
                        changePic();
                        setShowResults(false)
                    }}>Update</button>
        </div>)
    }
      
    return (
        <div className="about">
            <div className="about-container">
                <div className='user-image'>
                    <img src={state ? JSON.parse(state).pic : console.log("State is null")} alt="User"/>
                    <Search />
                </div>
                <div className='user-info'>
                    <div className="Name">{state ? JSON.parse(state).name : console.log("State is null")}</div>
                    <div className="Username">{state ? JSON.parse(state).username : console.log("State is null")}</div>
                    <div className="user-stats">
                        <span>{state ? JSON.parse(state).followers.length : console.log("State is null")} followers</span>
                        <span>{state ? JSON.parse(state).following.length : console.log("State is null")} following</span>
                    </div> 
                </div>
            </div>
        </div>
    )
};

export default About;