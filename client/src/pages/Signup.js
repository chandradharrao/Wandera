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

    const PostData = () => {
        if(!re.test(email)){
            alert("Invalid email address. Please enter a valid email.");
            return;
        }
        if (!validate(dob)) {
            alert("Sorry! You've got to be older than 18 years.");
            return;
        }
        if (password.length < 7) {
            alert("Password too short. Enter a stronger password.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        } else {
            fetch('/signup', {
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
            }).then(data => {
                if(data.error) {
                    console.log("Error!", data);
                } else {
                    alert("Successfully created an account!");
                    history.push('/login');
                }
            }).then(res => res.json())
            .catch(err => {
                console.log(err);
            });
        };
    };
    
    return (
        <div>
            <NavbarMain/>
            <div className="signup-page">
                <div className="signup-contents">
                    <div className="signup-container">
                        <h1>Create an Account</h1>
                        <div className="signup-form">
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