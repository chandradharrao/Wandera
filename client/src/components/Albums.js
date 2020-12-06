import React, {useEffect, useState} from 'react';
import "./Albums.css";

const Albums = () => {
    const [myPosts, setPosts] = useState([]);

    useEffect(() => {
        fetch('/viewmyposts', {
            headers: {
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => {
            setPosts(data.myPost);
        })
    }, []);

    return (
        <div className="albums">
            <div className="albums-container">
                {
                    myPosts.slice(0).reverse().map(item => {
                        return (
                            <img src={item.photo} alt={item.title} key={item._id}/>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default Albums;