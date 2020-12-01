import React from 'react';
import "./Albums.css";
import image1 from "../images/img-6.jpg"
import image2 from "../images/img-1.jpg"
import image3 from "../images/img-2.jpg"
import image4 from "../images/img-3.jpg"
import image5 from "../images/img-4.jpg"

const Albums = () => {
    return (
        <div className="albums">
            <div className="albums-container">
                {/* <Album /> */}
                <img src={image1} alt="example"/>
                <img src={image2} alt="example"/>
                <img src={image3} alt="example"/>
                <img src={image4} alt="example"/>
                <img src={image5} alt="example"/>
            </div>
        </div>
    )
};

export default Albums;