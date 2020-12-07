import React, {useContext} from 'react';
import {UserContext} from "../App";
import "./About.css";
import ProfilePic from "../images/profilepic.jpg";

const About = () => {
    const {state, dispatch} = useContext(UserContext);

    return (
        <div className="about">
            <div className="about-container">
                <div className='user-image'>
                    <img src={ProfilePic} alt="User"/>
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