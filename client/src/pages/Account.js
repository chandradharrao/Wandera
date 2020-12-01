import React from 'react';
import About from '../components/About';
import Albums from '../components/Albums';
import Navbar from '../components/NavbarProf';

const Account = () => {
    return (
    <div className="account-landing">
        <Navbar />
        <div className="account-page">
            <About />
            <Albums />
        </div>
    </div>
    )
};

export default Account;