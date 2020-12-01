import React from 'react';
import NavbarMain from "../components/NavbarMain";
import "./Signup.css";

const Signup = () => {
    return (
        <div>
            <NavbarMain/>
            <div className="signup-page">
                <div className="signup-contents">
                    <div className="signup-container">
                        <h1>Create an Account</h1>
                        <form action="/signup-post" class="signup-form" method="POST">
                            <label for="fname">First Name</label>
                            <input type="text" name="fname" required /><br/>
                            <label for="lname">Last Name</label>
                            <input type="text" name="lname" required /><br/>
                            <label for="email">Email Address</label>
                            <input type="text" name="email" required /><br/>
                            <label for="dob">Date of Birth</label>
                            <input type="date" name="dob" min="1900-01-01" required /><br/>
                            <label for="username">Username</label>
                            <input type="text" name="username" required /><br/>
                            <label for="password">Password</label>
                            <input type="password" name="password" required /><br/>
                            <label for="confirm_password">Confirm Password</label>
                            <input type="password" name="confirm_password" required /><br/>
                            <input type="submit" value="SIGN UP" class="form-submit" />
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