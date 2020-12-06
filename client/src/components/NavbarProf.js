import React, { useContext } from 'react';
import {useHistory} from 'react-router-dom';
import {UserContext} from "../App";
import "./Navbar.css";
import logo from "../images/WanderaLogo.png";

const NavbarProf = () => {
    const history = useHistory();
    // eslint-disable-next-line no-unused-vars
    const {state, dispatch} = useContext(UserContext);

    return (
        <div className="Navbar">
        <header>
            <a href='/'><img className="logo" src={logo} alt="Logo" width="260px" height="auto" /></a>
            <nav>
                <ul className="nav-links">
                    <li><a href = '/search'>Find Wanderers</a></li>
                    <li><a href="/main">Explore</a></li>
                    <li><a href="/forum">Discuss</a></li>
                    <li><a href="/account">Profile</a></li>
                    <li><button className="logout-button" 
                    onClick={() => {
                        /* Clear out temporary session history */
                        localStorage.clear();
                        dispatch({type: "CLEAR"})
                        history.push('/login');
                    }}>Logout</button></li>
                    <li><a href="/post"><button className="standout-button">Create Album</button></a></li>
                </ul>
            </nav>
        </header>
        </div>
    )
};

export default NavbarProf;