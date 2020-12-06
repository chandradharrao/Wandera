import React, {useContext, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {UserContext} from "../App";
import NavbarMain from "../components/NavbarMain";
import "./Login.css";

const Login = () => {
    // eslint-disable-next-line no-unused-vars
    const {state, dispatch} = useContext(UserContext);
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const PostLoginData = async (e) => {
        const res = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // In the header of request, the token is sent so that it is authorized using JWT authorization
                // "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        
        const file = await res.json();
        console.log('File: ', file);
    
        if (res.status === 404) {
            alert('This account does not exist. Please sign up to create an account.');
        } else if (res.status === 422) {
            alert("The password is incorrect. Please retry.");
        } else {
            /* The backend sends the token when a user logs in along 
            with the user data in the response object. We store it in 
            the local cache to be used while making requests to 
            protected resources */
            localStorage.setItem("jwt", file.token);
            
            /* Since we can store only strings in the local storage
                as key value pairs, we stringify the json user details */
            localStorage.setItem("user", JSON.stringify(file.user));
            dispatch({type: "USER", payload: file.user})
            history.push('/main');
        }
    };

    return (
        <div className="login-landing">
            <NavbarMain/>
            <div className="login-page">
                <div className="login-contents">
                    <div className="login-container">
                        <h1>Login to your Account</h1>
                        <div className="login-form">
                            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required /><br/>
                            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                            <button className="form-submit" onClick={() => PostLoginData()}>LOGIN</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;