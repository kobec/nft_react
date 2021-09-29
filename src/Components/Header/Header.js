import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getJWTToken, handleLogIn, handleLogOut } from '../../util/metamask';
import {
    getCurrentWalletConnected,
    connectWallet,
} from "../../util/interact.js";


import './header.css';

const Header = () => {
    const location = useLocation();
    //destructuring pathname from location
    const { pathname } = location;
    const [walletAddress, setWallet] = useState("");
    const [JWTToken, setJWTToken] = useState('');
    const splitLocation = pathname.split("/");

    const updateData = async () => {
        const { address } = await getCurrentWalletConnected();

        setWallet(address);
        setJWTToken(getJWTToken());
    };

    useEffect(async () => {
        await updateData();
        addWalletListener();

    }, []);

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setWallet(walletResponse.address);
    };

    const handleClickLogIn = async () => {
        await handleLogIn();
        await updateData();
    };

    const handleClickLogOut = async () => {
        handleLogOut();
        await updateData();
    };

    const addWalletListener = () => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                } else {
                    setWallet('');
                }
            });
        }
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
                    {JWTToken && JWTToken.length > 0 ? (
                        <button className="btn btn-primary" onClick={ handleClickLogOut }>
                            Log Out
                        </button>
                    ) : (
                        <button className="btn btn-primary" onClick={ handleClickLogIn }>
                            Log In With a MetaMask
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;