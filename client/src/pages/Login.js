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
                'Content-Type': 'application/json',
                //in the header of request we will send the token so that we can get authorized using jwt authorization
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => res.json()).then(data => {
            if(data.error) {
                console.log("Error!", data);
            } else {
                console.log(`The data recievied is ${data},it has the token ${data.token} and the user data ${data.user}`);
                //the backend sends the token when a user logs in along with the user data in the res obj.We need to store it in the local cache to be used while making requests to protected resources
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));//since we can store only strings in the local storeage key value pair we need to stringify the json user details
                history.push('/account');
            }
        })
        .catch(err => {
            alert(err);
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