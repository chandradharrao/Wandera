import React, {useState, useEffect} from 'react';
import Navbar from '../components/NavbarProf';
import "./Main.css";

import like_icon from "../images/Like.png";

const Main = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/viewallposts', {
            headers: {
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => {
            setData(data.posts);
        })
     });

    return (
    <div className="main-page">
        <Navbar />
        {
            /* Make a copy of the data posts array, 
            and reverse it to display newest posts first  */
            data.slice(0).reverse().map(item => {
                return (
                    <div className="main-container" key={item._id}>
                        <div className="main-post-container">
                            <div className="user-main-info">
                                <p>{item.postedByUName}</p>
                            </div>
                            <img src={item.photo} alt="User" className="user-main-image" />
                            <div className="main-icons">
                                <img src={like_icon} alt="Like"/>
                            </div>
                            <div className="main-post-content">
                                <h3>{item.title}</h3>
                                <p>{item.body}</p>
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