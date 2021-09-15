import React from 'react';
import { Link } from 'react-router-dom';

import './header.css';

const Header = ({ onServiceChange }) => {
    return (
        <div className="header d-flex">
            <h3>
                <Link to="/">
                    Smart Minter
                </Link>
            </h3>
            <ul className="d-flex">
                <li>
                    <Link to="/">Mint U Media</Link>
                </li>
                <li>
                    <Link to="/collected">Collected</Link>
                </li>
            </ul>

            <button
                onClick={onServiceChange}
                className="btn btn-primary btn-sm">
                Change Service
            </button>
        </div>
    );
};

export default Header;