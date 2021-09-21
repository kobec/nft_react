import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogInWithMetaMask } from '../../util/metamask';
import {
    connectWallet,
} from "../../util/interact.js";


import './header.css';

const Header = () => {
    const location = useLocation();
    //destructuring pathname from location
    const { pathname } = location;
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const splitLocation = pathname.split("/");

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
    };

    return (
        <div className="header d-flex justify-content-between">
            <div className="d-flex">
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
            <div className="d-flex justify-content-between">
                <div>
                    <button className="btn" id="walletButton" onClick={connectWalletPressed}>
                        {walletAddress.length > 0 ? (
                            "Connected: " +
                            String(walletAddress).substring(0, 6) +
                            "..." +
                            String(walletAddress).substring(38)
                        ) : (
                            <span>Connect Wallet</span>
                        )}
                    </button>
                </div>
                <div>
                    <LogInWithMetaMask />
                </div>
            </div>
        </div>
    );
};

export default Header;