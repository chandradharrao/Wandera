import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import "../components/About.css";
import "../components/Albums.css";
import Navbar from '../components/NavbarProf';

const Account = () => {
    const {username} = useParams();

    const [User, setUser] = useState([]);
    const [Posts, setPosts] = useState([]);
    const [FollowersCount, setFollowersCount] = useState(0);
    const [isFollowed, setisFollowed] = useState(false);

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
        }).catch(err=>{
            console.log(err)
        })
    }, [username]);

    //fetch the followers count onmount to display
    useEffect(() => {
        fetch(`/get-user-followers-details?username=${username}`, {
            method:"GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setFollowersCount(data.num_followers);
            setisFollowed(data.isFollowed);
        }).catch(err=>{
            console.log(err)
        })
    }, [username])

    useEffect(() => {
        fetch(`/get-user-followers-details?username=${username}`, {
            method:"GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setisFollowed(data.isFollowed);
        }).catch(err=>{
            console.log(err)
        })
    }, [FollowersCount, username])

    const followUser = ()=>{
        fetch('/follow',{
            method:"POST",
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
            setFollowersCount(data.num_followers);
        }).catch(err=>{
            console.log(err);
        })
    }

    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"POST",
            headers:{
                "Content-Type":"Application/json",
                "Authorization":"Bearer " + localStorage.getItem('jwt') 
            },
            body:JSON.stringify({
                toUnFollowuname:username
            })
        }).then(res=>res.json()).then(data=>{
            console.log("Started unfollowing...");
            console.log(data);
            setFollowersCount(data.num_followers);
        }).catch(err=>{
            console.log(err);
        })
    }

    const unfollow_follow = ()=>{
        if(isFollowed){
            console.log("Unfollowing user...")
            unfollowUser();
        }
        else{
            if(username !== JSON.parse(localStorage.getItem('user')).username){
                console.log("Follwoing user..");
                followUser();
            }
            else{
                alert("You cannot follow yourself")
            }
        }
    }

    return (
        <div className="account-landing">
            <Navbar />
            <div className="account-page">
                <div className="about">
                    <div className="about-container">
                        <div className='user-image'>
                            <img src="https://res.cloudinary.com/chandracloudinarystorage123/image/upload/v1658664452/Default/default_profile_pic_wdfejd.png" alt="User"/>
                        </div>
                        <div className='user-info'>
                            <div className="Name">{User.username}</div>
                            <div className="Username">{User.username}</div>
                            <div className="user-stats">
                                <span>{FollowersCount} followers</span>
                                <span>{User.following ? User.following.length : console.log("Await")} following</span>
                                <button className="account-page-buttons" onClick={()=>unfollow_follow()}>{isFollowed?"Unfollow -":"Follow +"}</button>
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