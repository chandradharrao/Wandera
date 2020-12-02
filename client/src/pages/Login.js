import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import NavbarMain from "../components/NavbarMain";
import "./Login.css";

const Login = () => {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const PostData = () => {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then(data => {
            if(data.error) {
                console.log("Error!", data);
            } else {
                history.push('/account');
            }
        }).then(res => res.json())
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <div className="login-landing">
            <NavbarMain/>
            <div className="login-page">
                <div className="login-contents">
                    <div className="login-container">
                        <h1>Login to your Account</h1>
                        <div class="login-form">
                            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required /><br/>
                            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                            <button class="form-submit" onClick={() => PostData()}>LOGIN</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;