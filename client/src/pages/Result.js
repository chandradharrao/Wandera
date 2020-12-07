import React,{useState} from 'react';
import { Link } from 'react-router-dom';
import './Search.css';

const Result = (props) => {
    const [userDetails, setUserDetails] = useState([]);//userDetails would be the list of users fetched from backend

    fetch('/searchusers',{
        method:"post",
        headers:{
            "Content-Type": "application/json",
            'Accept': "application/json"
        },
        body:JSON.stringify({
            query: props.data
        })
    })
    .then(res => res.json())
    .then(results => {
        setUserDetails(results.users);
    });

    var usernameList = [];
    if(userDetails.length!==0){
        for(var i = 0; i < userDetails.length; i++) {
            if(userDetails[i].username!=='')
                usernameList.push(
                    <div className = "search-result" key = {i}>
                        <div id = "search-username">{userDetails[i].username}</div>
                        <img id = "search-profile-pic" alt="Profile" src = {userDetails[i].profile_pic}/>
                        <div id = "search-followers">Followers : {userDetails[i].followers.length}
                        </div>
                        <Link to = {"/viewprofile/"+userDetails[i].username}><button id = "visit-page-button" >View Profile</button></Link>
                    </div>
                )
        }
    }

    return(
        <div className = "search-results">
            {usernameList}
        </div>
    )
}

export default Result;