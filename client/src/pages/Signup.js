import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import NavbarMain from "../components/NavbarMain";
import "./Signup.css";

const Signup = () => {
    const history = useHistory();
    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDOB] = useState({varDOB: new Date()});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirm] = useState("");

    const PostData = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match");
        } else {
            fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    wanderer: {
                        fname,
                        lname,
                        email,
                        dob,
                        username,
                        password
                    }
                })
            }).then(res => res.json())
            .then(data => {
                if(data.error) {
                    console.log("Error!", data);
                } else {
                    history.push('/login');
                }
            })
        }
    };
    
    return (
        <div>
            <NavbarMain/>
            <div className="signup-page">
                <div className="signup-contents">
                    <div className="signup-container">
                        <h1>Create an Account</h1>
                        <form class="signup-form">
                            <label for="fname">First Name</label>
                            <input type="text" name="fname" value={fname} onChange={(e) => setFName(e.target.value)} required /><br/>
                            <label for="lname">Last Name</label>
                            <input type="text" name="lname" value={lname} onChange={(e) => setLName(e.target.value)} required /><br/>
                            <label for="email">Email Address</label>
                            <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br/>
                            <label for="dob">Date of Birth</label>
                            <input type="date" name="dob" min="1900-01-01" value={dob} onChange={(e) => setDOB(e.target.value)} required /><br/>
                            <label for="username">Username</label>
                            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br/>
                            <label for="password">Password</label>
                            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br/>
                            <label for="confirm_password">Confirm Password</label>
                            <input type="password" name="confirm_password" value={confirmPassword} onChange={(e) => setConfirm(e.target.value)} required /><br/>
                            <button class="form-submit" onClick={() => PostData()}>SIGN UP</button>
                        </form>
                        <div className="have-account">
                            Already have an account?
                            <a href="/login">Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Signup;