import Web3 from 'web3';
import React, {useState} from 'react';

let web3 = Web3 | undefined; // Will hold the web3 instance

const apiBaseUrl = process.env.REACT_APP_API_BASE;

const JWTToken = localStorage.getItem('JWTToken');

const signMessage = 'I am signing my one-time nonce: ';

const handleAuthenticate = ({ network_identity, signature }) =>
    fetch(`${apiBaseUrl}/metamask/auth`, {
        body: JSON.stringify({ network_identity, signature }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
    }).then((response) => response.json());

const handleSignMessage = async ({ network_identity, network_nonce }) => {
    try {
        const signature = await web3.eth.personal.sign(
            signMessage + network_nonce,
            network_identity,
            '' // MetaMask will ignore the password argument here
        );

        return { network_identity, signature };
    } catch (err) {
        throw new Error(
            'You need to sign the message to be able to log in.'
        );
    }
};

const handleSignup = (network_identity) =>
    fetch(`${apiBaseUrl}/metamask/signup`, {
        body: JSON.stringify({ network_identity }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
    }).then((response) => response.json());

const onLoggedIn = (data) => {
    const { token } = data;

    if (token) {
        localStorage.setItem('JWTToken', token);

        window.location.href = '/';
    }
};

const handleClickLogIn = async () => {
    // Check if MetaMask is installed
    if (! window.ethereum) {
        window.alert('Please install MetaMask first.');
        return;
    }

    if (! web3) {
        try {
            // Request account access if needed
            await window.ethereum.enable();

            // We don't know window.web3 version, so we use our own instance of Web3
            // with the injected provider given by MetaMask
            web3 = new Web3(window.ethereum);

        } catch (error) {
            window.alert('You need to allow MetaMask.');
            return;
        }
    }

    const coinbase = await web3.eth.getCoinbase();
    if (! coinbase) {
        window.alert('Please activate MetaMask first.');
        return;
    }

    const publicAddress = coinbase.toLowerCase();

    // Look if user with current publicAddress is already present on backend
    fetch(`${apiBaseUrl}/metamask/user/${publicAddress}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'GET',
    })
        .then((response) => response.json())
        // If yes, retrieve it. If no, create it.
        .then((user) => Object.entries(user).length ? user : handleSignup(publicAddress))
        // Popup MetaMask confirmation modal to sign message
        .then(handleSignMessage)
        // Send signature to backend on the /auth route
        .then(handleAuthenticate)
        // Pass accessToken back to parent component (to save it in localStorage)
        .then(onLoggedIn)
        .catch((err) => {
            window.alert(err);
        });
};

const handleClickLogOut = async () => {
    if (localStorage.getItem('JWTToken')) {
        localStorage.removeItem('JWTToken');
    }
    window.location.href = '/';
};

const LogInWithMetaMask = () => {
    const [loggedIn, setLoggedIn] = useState( !!localStorage.getItem('JWTToken'));

    const onLoggedIn = (data) => {
        const { token } = data;
        setLoggedIn(true);
        if (token) {
            localStorage.setItem('JWTToken', token);

          //  window.location.href = '/';
        }
    };

    const handleClickLogIn = async () => {
        // Check if MetaMask is installed
        if (! window.ethereum) {
            window.alert('Please install MetaMask first.');
            return;
        }

        if (! web3) {
            try {
                // Request account access if needed
                await window.ethereum.enable();

                // We don't know window.web3 version, so we use our own instance of Web3
                // with the injected provider given by MetaMask
                web3 = new Web3(window.ethereum);

            } catch (error) {
                window.alert('You need to allow MetaMask.');
                return;
            }
        }

        const coinbase = await web3.eth.getCoinbase();
        if (! coinbase) {
            window.alert('Please activate MetaMask first.');
            return;
        }

        const publicAddress = coinbase.toLowerCase();

        // Look if user with current publicAddress is already present on backend
        fetch(`${apiBaseUrl}/metamask/user/${publicAddress}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'GET',
        })
            .then((response) => response.json())
            // If yes, retrieve it. If no, create it.
            .then((user) => Object.entries(user).length ? user : handleSignup(publicAddress))
            // Popup MetaMask confirmation modal to sign message
            .then(handleSignMessage)
            // Send signature to backend on the /auth route
            .then(handleAuthenticate)
            // Pass accessToken back to parent component (to save it in localStorage)
            .then(onLoggedIn)
            .catch((err) => {
                window.alert(err);
            });
    };


    return (
        loggedIn ?
        <button className="btn btn-primary" onClick={ handleClickLogOut }>
            Log Out
        </button> :
        <button className="btn btn-primary" onClick={ handleClickLogIn }>
            Log In With a MetaMask
        </button>
    );
}

export { LogInWithMetaMask };
