import {pinJSONToIPFS, pinFileToIPFS} from "./pinata.js";

require("dotenv").config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
//const contractABI = require("../contract-abi.json");
const contractABI = require("../contract-abi-snft.json");
//const contractAddress = "0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE";
//const contractAddress = "0x88a9780Fb8077c40CF02402a8eea829abE63F286";//ownable
//const contractAddress = "0xfaCf2DeE4197560D74E26C1158D17152b5384F2e";
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const {createAlchemyWeb3} = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);
//const fs = require('fs');

export const connectWallet = async () => {
    if (window.ethereum) {

        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
            </a>
                    </p>
                </span>
            ),
        };
    }
};

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            });
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "👆🏽 Write a message in the text-field above.",
                };
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                };
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
            </a>
                    </p>
                </span>
            ),
        };
    }
};

// async function loadContract() {
//     return new web3.eth.Contract(contractABI, contractAddress);
// }

export const tokenOwner = async (contract, token_id) => {
    if(!window.contract) {
        window.contract = await new web3.eth.Contract(contractABI, contract);
    }
    return window.contract.methods.ownerOf(token_id).call();
}

export const disallowBuy = async (contract, token_id) => {
    try {
        const transactionParameters = {
            to: contractAddress, // Required except during contract publications.
            from: window.ethereum.selectedAddress, // must match user's active address.
            data: window.contract.methods
                .disallowBuy(token_id)
                .encodeABI(),
        };
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            success: true,
            status:
                "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
                txHash,
        };
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message,
        };
    }
}

export const allowBuy = async (contract, token_id, value) => {
    try {
        const transactionParameters = {
            to: contractAddress, // Required except during contract publications.
            from: window.ethereum.selectedAddress, // must match user's active address.
            data: window.contract.methods
                .allowBuy(token_id, value)
                .encodeABI(),
        };
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            success: true,
            status:
                "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
                txHash,
        };
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message,
        };
    }
}

export const getTokenPrice = async (tokenId,unit='') => {
    if(!window.contract) {
        window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    }
    let weiPrice= await window.contract.methods
        .getTokenPrice(tokenId)
        .call()
    if(unit===''){
        return weiPrice;
    }
    return web3.utils.fromWei(weiPrice,unit);
}

export const buy = async (tokenId) => {
    if(!window.contract) {
        window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    }
    /*window.contract.events.NftBought({fromBlock: 0}, function(error, event){ console.log(event); })
        .on("connected", function(subscriptionId){
            console.log(subscriptionId);
        })
        .on('data', function(event){
            console.log(event); // same results as the optional callback above
        })
        .on('changed', function(event){
            // remove event from local database
        })
        .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log(error);
        });*/
   /* window.contract.NftBought().watch({}, '', function(error, result) {
        alert('1');
        if (!error) {
           console.log("Coin transfer: " + result.args.amount +
                " coins were sent from " + result.args.from +
                " to " + result.args.to + ".");
            console.log("Balances now:\n" +
                "Sender: " + Coin.balances.call(result.args.from) +
                "Receiver: " + Coin.balances.call(result.args.to));
            console.log(result);
        }
    })*/
    let tokenPrice = await window.contract.methods
        .getTokenPrice(tokenId)
        .call();
    try {
        const transactionParameters = {
            to: contractAddress, // Required except during contract publications.
            from: window.ethereum.selectedAddress, // must match user's active address.
            value: web3.utils.numberToHex(tokenPrice),
            data: window.contract.methods
                .buy(tokenId)
                .encodeABI(),
        };
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            success: true,
            status:
                "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
                txHash,
        };
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message,
        };
    }

    return {
        success: false,
        status: "test",
    }
}


export const transferToken = async (toAddress, tokenId) => {
    if (toAddress.trim() === "") {
        return {
            success: false,
            status: "❗Please enter valid wallet address",
        };
    }
    if(!window.contract) {
        window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    }

    try {
        const transactionParameters = {
            to: contractAddress, // Required except during contract publications.
            from: window.ethereum.selectedAddress, // must match user's active address.
            data: window.contract.methods
                .transferFrom(window.ethereum.selectedAddress, toAddress, tokenId)
                .encodeABI(),
        };
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            success: true,
            status:
                "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
                txHash,
        };
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message,
        };
    }

    return {
        success: false,
        status: "test",
    }
}

export const mintNFT = async (url, name, description) => {
    if (url.trim() === "" || name.trim() === "" || description.trim() === "") {
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        };
    }

    //make metadata
    const metadata = new Object();
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        };
    }
    console.log(pinataResponse);
    const tokenURI = pinataResponse.pinataUrl;
    //console.log(tokenURI);
    if(!window.contract) {
        window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    }
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        data: window.contract.methods
            .mintNFT(window.ethereum.selectedAddress, tokenURI)
            .encodeABI(),
    };

    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            success: true,
            status:
                "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
                txHash,
        };
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message,
        };
    }
};


export const mintNFTFromSelectedFile = async (file, name, description) => {
    if (!file || name.trim() === "" || description.trim() === "") {
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        };
    }
    //first - upload media to the pinata
    let data = new FormData();
    data.append('file', file);
    //make metadata
    const pinataMetadata = new Object();
    pinataMetadata.name = name;
    pinataMetadata.description = description;
    const metadataJson = JSON.stringify(pinataMetadata);
    data.append('pinataMetadata', metadataJson);
    //console.log(data);
    const pinataMediaResponse = await pinFileToIPFS(data);
    if (!pinataMediaResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        };
    }
    const pinataMediaUrl = pinataMediaResponse.pinataUrl;
    //now use pinJSONToIPFS to prepare appropriate NFT token object
    //make metadata
    const metadata = new Object();
    metadata.name = name;
    metadata.image = pinataMediaUrl;
    metadata.description = description;

    const pinataResponse = await pinJSONToIPFS(metadata);
    const tokenURI = pinataResponse.pinataUrl;
    console.log(tokenURI);
    if(!window.contract) {
        window.contract = await new web3.eth.Contract(contractABI, contractAddress);
    }

    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        data: window.contract.methods
            .mintNFT(window.ethereum.selectedAddress, tokenURI)
            .encodeABI(),
    };

    try {
        const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transactionParameters],
        });
        return {
            success: true,
            status:
                "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
                txHash,
        };
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message,
        };
    }
};
