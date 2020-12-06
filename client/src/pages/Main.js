import React, {useState, useEffect} from 'react';
import Navbar from '../components/NavbarProf';
import "./Main.css";
import image1 from "../images/img-4.jpg";
// import image2 from "../images/img-8.jpg";
// import image3 from "../images/img-home.jpg";
import like_icon from "../images/Like.png";

const Main = () => {
    const [data, setData] = useState([]);

    useEffect(()=>{
        fetch('/viewmyfeed', {
            headers: {
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(`Main feed view posts response: ${JSON.stringify(data)}`);
            setData(data.posts);
        })
     },[]);

    return (
    <div className="main-page">
        <Navbar />
        {
            data.map(item => {
                return (
                    <div className="main-container">
                        <div className="main-post-container">
                            <div className="user-main-info">User Name</div>
                            <img src={image1} alt="User" className="user-main-image" />
                            <div className="main-icons">
                                <img src={like_icon} alt="Like"/>
                            </div>
                            <div className="main-post-content">
                                <h3>Is it working?</h3>
                                <p>This is actually working...or not.</p>
                                <input type="text" placeholder="Add a comment"/>
                            </div>
                        </div>
                     </div>                    
                );
            })
        }   
    </div>
    )
};

export default Main;