import { useEffect, useState } from "react";
import {
    connectWallet,
    getCurrentWalletConnected,
    mintNFT,
    mintNFTFromSelectedFile
} from "./util/interact.js";

import { LogInWithMetaMask } from './util/metamask.js';

const Minter = (props) => {
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [url, setURL] = useState("");
    const [file, setFile] = useState("");

    useEffect(async () => {
        const { address, status } = await getCurrentWalletConnected();

        setWallet(address);
        setStatus(status);

        addWalletListener();
    }, []);

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    setStatus("👆🏽 Write a message in the text-field above.");
                } else {
                    setWallet("");
                    setStatus("🦊 Connect to Metamask using the top right button.");
                }
            });
        } else {
            setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="_blank" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
                    </a>
                </p>
            );
        }
    }

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
    };

    const onMintPressed = async () => {
        //const { success, status } = await mintNFT(url, name, description, file);
        const { success, status } = await mintNFTFromSelectedFile(file, name, description);
        setStatus(status);
        if (success) {
            setName("");
            setDescription("");
            setURL("");
            setFile("");
        }
    };

    return (
        <div className="Minter">
            <div className="d-flex justify-content-between">
                <div>
                    <LogInWithMetaMask />
                </div>
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
            </div>
            <br></br>
            <h1 id="title">🧙‍♂️ Alchemy NFT Minter</h1>
            <p>
                Simply add your asset's link, name, and description, then press "Mint."
            </p>
            <form>
                <h2>🖼 Select asset: </h2>
                <input
                    className="input-file"
                    type="file"
                    onChange={(event) => setFile(event.target.files[0])}
                />
                {/*<h2>🖼 Link to asset: </h2>
                <input
                    type="text"
                    placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
                    onChange={(event) => setURL(event.target.value)}
                />*/}
                <h2>🤔 Name: </h2>
                <input
                    type="text"
                    placeholder="e.g. My first NFT!"
                    onChange={(event) => setName(event.target.value)}
                />
                <h2>✍️ Description: </h2>
                <input
                    type="text"
                    placeholder="e.g. Even cooler than cryptokitties ;)"
                    onChange={(event) => setDescription(event.target.value)}
                />
            </form>
            <button className="btn btn-success" id="mintButton" onClick={onMintPressed}>
                Mint NFT
            </button>
            <p className="status" id="status" style={{ color: "red" }}>
                {status}
            </p>
        </div>
    );
};

export default Minter;