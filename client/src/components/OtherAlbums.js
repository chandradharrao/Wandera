import React, {useEffect, useState} from 'react';
import "./Albums.css";

const Albums = () => {
    const [myPosts, setmyPosts] = useState([]);

    useEffect(() => {
        fetch('/viewmyposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => res.json())
        .then(data => {
            setmyPosts(data.myPost);
        })
    }, []);

    return (
        <div className="albums">
            <div className="albums-container">
                {
                    myPosts.slice(0).reverse().map(item => {
                        return (
                            <a href="/profile"><img src={item.photo} alt={item.title} key={item._id} className="post-image"/></a>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default Albums;