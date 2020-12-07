import React from 'react';
import OtherAbout from '../components/OtherAbout';
import OtherAlbums from '../components/OtherAlbums';
import Navbar from '../components/NavbarProf';

const Account = () => {
    return (
    <div className="account-landing">
        <Navbar />
        <div className="account-page">
            <OtherAbout />
            <OtherAlbums />
        </div>
    </div>
    )
};

export default Account;