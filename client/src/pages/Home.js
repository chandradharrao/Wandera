import React from 'react';
import NavbarMain from "../components/NavbarMain";
import videoFile from "../videos/video-1.mp4";
import "./Home.css";

const Home = () => {
    return (
        <div>
            <NavbarMain/>
            <div className='home-page'>
                <div className="banner">
                    <video className="home-video-1" src={videoFile} autoPlay loop muted />
                    <div className="banner-items">
                        <h1>Showcase your Adentures</h1>
                        <p className="banner-para">
                            Share your memories with the world. Unleash your creativity and weave stories.
                        </p>
                        <div className="banner-buttons">
                            <a href='/sign-up'>
                                <button class="create-account">Create an Account</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Home;