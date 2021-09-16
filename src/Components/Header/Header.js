import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import './header.css';

const Header = () => {
    const location = useLocation();
    //destructuring pathname from location
    const { pathname } = location;
    const splitLocation = pathname.split("/");

    return (
        <div className="header d-flex">
            <h3>
                <Link to="/">
                    Smart Minter
                </Link>
            </h3>
            <ul className="d-flex">
                <li className={splitLocation[1] === "" ? "active" : ""}>
                    <Link to="/">Mint U Media</Link>
                </li>
                <li className={splitLocation[1] === "collected" ? "active" : ""}>
                    <Link to="/collected">Collected</Link>
                </li>
            </ul>
        </div>
    );
};

export default Header;