import React from 'react';
import "./Navbar.css";
import logo from "../images/WanderaLogo.png";

const NavbarMain = () => {
    return (
        <div className="Navbar">
        <header>
            <a href='/'><img className="logo" src={logo} alt="Logo" width="260px" height="auto" /></a>
            <nav>
                <ul className="nav-links">
                    <li><a href = '/search'>Find Wanderers</a></li>
                    <li><a href="/main">Explore</a></li>
                    <li><a href="/forum">Discuss</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href='/sign-up'><button className="standout-button">SIGN UP</button></a></li>
                </ul>
            </nav>
        </header>
        </div>
    )
};

export default NavbarMain;