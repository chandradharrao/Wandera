import React from 'react';
import NavbarMain from "../components/NavbarMain";
import "./Login.css";

const Login = () => {
    return (
        <div className="login-landing">
            <NavbarMain/>
            <div className="login-page">
                <div className="login-contents">
                    <div className="login-container">
                        <h1>Login to your Account</h1>
                        <form action="/login-post" class="login-form" method="POST">
                            <input type="text" name="username" placeholder="Username" required /><br/>
                            <input type="password" name="password" placeholder="Password" required />
                            <input type="submit" value="LOGIN" class="form-submit" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;