import React from 'react';
import Navbar from '../components/NavbarProf';
import "./Main.css";
import image1 from "../images/img-4.jpg";
import image2 from "../images/img-8.jpg";
import image3 from "../images/img-home.jpg";

const Main = () => {
    return (
    <div className="main-page">
        <Navbar />
        <div className="main-container">
            <div className="main-post-container">
                <div className="user-main-info">User Name</div>
                <img src={image1} alt="User" className="user-main-image" />
                <div className="main-post-content">
                    <h3>Is it working?</h3>
                    <p>This is actually working...or not.</p>
                    <input type="text" placeholder="Add a comment"/>
                </div>
            </div>
            <div className="main-post-container">
                <div className="user-main-info">User Name</div>
                <img src={image2} alt="User" className="user-main-image" />
                <div className="main-post-content">
                    <h3>Is it working?</h3>
                    <p>This is actually working...or not.</p>
                    <input type="text" placeholder="Add a comment"/>
                </div>
            </div>
            <div className="main-post-container">
                <div className="user-main-info">User Name</div>
                <img src={image3} alt="User" className="user-main-image" />
                <div className="main-post-content">
                    <h3>Please please work</h3>
                    <p>Lorem ipsum yada yada.</p>
                    <input type="text" placeholder="Add a comment"/>
                </div>
            </div>
        </div>
    </div>
    )
};

export default Main;