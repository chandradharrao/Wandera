import React from 'react';
import "./Navbar.css";
import logo from "../images/WanderaLogo.png";

const NavbarProf = () => {
    return (
        <div className="Navbar">
        <header>
            <a href='/'><img className="logo" src={logo} alt="Logo" width="260px" height="auto" /></a>
            <nav>
                <ul className="nav-links">
                    <li><a href="/main">Explore</a></li>
                    <li><a href="/forum">Discuss</a></li>
                    <li><a href="/account">Profile</a></li>
                    <li><a href="/post"><button className="button">Create Album</button></a></li>
                </ul>
            </nav>
        </header>
        </div>
    )
};

export default NavbarProf;