/* eslint-disable no-useless-escape */
import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import NavbarMain from "../components/NavbarMain";
import "./Signup.css";

const moment = window.moment;

function validate(date) {
    var eighteenYearsAgo = moment().subtract(18, "years");
    var birthday = moment(date);

    if (!birthday.isValid())
        return 0;    
    else if (eighteenYearsAgo.isAfter(birthday))
        return 1;    
    else
        return 0;    
}

const Signup = () => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const history = useHistory();
    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDOB] = useState({varDOB: new Date()});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirm] = useState("");

    const PostSignupData = async (e) => {
        if(!re.test(email)){
            alert("Invalid email address. Please enter a valid email.");
        }
        else if (!validate(dob)) {
            alert("Sorry! You've got to be older than 18 years.");
        }
        else if (password.length < 7) {
            alert("Password too short. Enter a stronger password.");
        }
        else if (password !== confirmPassword) {
            alert("Passwords don't match");
        } else {
            const res = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fname,
                    lname,
                    email,
                    dob,
                    username,
                    password
                })
            });
            
            const file = await res.json();
            const status = res.status;
            console.log(`Signup response JSON: ${JSON.stringify(file)}\nResponse status: ${status}`);
            
            if (status === 404) {
                alert(file.error);
            } else if (status === 400) {
                console.log(`Singup response error: ${file.error}`);
            } else {
                alert("Successfully created an account!");
                history.push('/login');
            }
        }
    };
    
    return (
        <div>
            <NavbarMain/>
            <div className="signup-page">
                <div className="signup-contents">
                    <div className="signup-container">
                        <h1>Create an Account</h1>
                        <div className="signup-form">
                            <label htmlFor="fname">First Name</label>
                            <input type="text" name="fname" value={fname} onChange={(e) => setFName(e.target.value)} required /><br/>
                            <label htmlFor="lname">Last Name</label>
                            <input type="text" name="lname" value={lname} onChange={(e) => setLName(e.target.value)} required /><br/>
                            <label htmlFor="email">Email Address</label>
                            <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required /><br/>
                            <label htmlFor="dob">Date of Birth</label>
                            <input type="date" name="dob" min="1900-01-01" value={dob} onChange={(e) => setDOB(e.target.value)} required /><br/>
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br/>
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br/>
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <input type="password" name="confirm_password" value={confirmPassword} onChange={(e) => setConfirm(e.target.value)} required /><br/>
                            <button className="form-submit" onClick={() => PostSignupData()}>SIGN UP</button>
                        </div>
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