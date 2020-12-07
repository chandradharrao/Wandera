import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import "../components/About.css";
import "../components/Albums.css";
import Navbar from '../components/NavbarProf';

import ProfilePic from "../images/profilepic.jpg";

const Account = () => {
    const {username} = useParams();

    const [User, setUser] = useState([]);
    const [Posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`/viewprofile/${username}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setUser(data.userInfo);
            setPosts(data.posts);
        })
    }, [username]);

    const followUser = ()=>{
        fetch('/follow',{
            method:"PUT",
            headers:{
                "Content-Type":"Application/json",
                "Authorization":"Bearer " + localStorage.getItem('jwt') 
            },
            body:JSON.stringify({
                toFollowuname:username
            })
        }).then(res=>res.json()).then(data=>{
            console.log("Started following...");
            console.log(data)
        }).catch(err=>{
            console.log(err);
        })
    }

    return (
        <div className="account-landing">
            <Navbar />
            <div className="account-page">
                <div className="about">
                    <div className="about-container">
                        <div className='user-image'>
                            <img src={ProfilePic} alt="User"/>
                        </div>
                        <div className='user-info'>
                            <div className="Name">{User.name}</div>
                            <div className="Username">{User.username}</div>
                            <div className="user-stats">
                                <span>{User.followers ? User.followers.length : console.log("Await")} followers</span>
                                <button id = "follow-bttn" onClick={()=>followUser()}>Follow</button>
                                <span>{User.following ? User.following.length : console.log("Await")} following</span>
                            </div> 
                        </div>
                    </div>
                </div>
                <div className="albums">
                    <div className="albums-container">
                        {
                            Posts.slice(0).reverse().map(item => {
                                return (
                                    <a href={`/profile/${item.postedByUName}`}><img src={item.photo} alt={item.title} key={item._id} className="post-image"/></a>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Account;