import React, { useState, useEffect } from 'react';
import FetcherService from '../../util/fetcher';
import './item-details.css';
import { useParams } from "react-router-dom";
import {getCurrentWalletConnected, tokenOwner, transferToken, allowBuy, disallowBuy, buy, getTokenPrice} from "../../util/interact.js";
import Spinner from '../Spinner/spinner';

const ItemDetails = () => {

    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [isItemOwner, setIsItemOwner] = useState(false);
    const [itemOwner, setItemOwner] = useState("");
    const [tokenPrice, setTokenPrice] = useState(0);
    const [tokenPriceUnit, setTokenPriceUnit] = useState('ether');

    const [sendAddress, setSendAddress] = useState("");
    const [sendPrice, setSendPrice] = useState(0);
    const [sendStatus, setSendStatus] = useState("");
    const [buyStatus, setBuyStatus] = useState("");

    const [nft, setNft] = useState([]);
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [disabledPrice, setDisabledPrice] = useState(true);

    const { contract_address, token_id } = useParams();

    const fetcher = new FetcherService();

    useEffect(() => {
        fetcher.getNftItem(contract_address, token_id)
            .then((response) => {
                setNft(response);
                setLoading(false);
            });

        getCurrentWalletConnected().then((answer) => {
            setWallet(answer.address);
            setStatus(answer.status);
            tokenOwner(contract_address, token_id).then(function (owner) {
                let bl = answer.address.toUpperCase() === owner.toUpperCase();
                setIsItemOwner(bl);
                setItemOwner(owner.toUpperCase());
            });
        });
        getTokenPrice(token_id,'ether').then((tokenPrice) => {
            setTokenPrice(tokenPrice);
        });
    }, []);

    const showSendBlock = () => setDisabled(!disabled);
    const showPriceBlock = () => setDisabledPrice(!disabledPrice);

    const onSendPressed = async () => {
        if (itemOwner.toUpperCase() === sendAddress.toUpperCase()) {
            setSendStatus("❗You cannot send your NFT to yourself");
            return;
        }

        const { success, status } = await transferToken(sendAddress, token_id);

        setSendStatus(status);

        if (success) {
            setSendAddress("");
        }
    }

    const onDisallowBuyPressed = async () => {
        if (!isItemOwner) {
            setSendStatus("❗You are not allowed to do this action");
            return;
        }
        const { success, status } = await disallowBuy(contract_address, token_id);
        setBuyStatus(status);
    }
    const onAllowBuyPressed = async () => {
        if (!isItemOwner) {
            setSendStatus("❗You are not allowed to do this action");
            return;
        }
        if(!sendPrice>0 || typeof sendPrice != 'number'){
            setSendStatus("❗Price must be greater then 0");
            return;
        }
        const { success, status } = await allowBuy(contract_address, token_id, sendPrice);
        setBuyStatus(status);
    }

    const onBuyPressed = async () => {
        try {
            const {success, status} = await buy(token_id);
            setBuyStatus(status);
        }catch (error) {
            setBuyStatus(error.message);
        }
    }

    return (
        <React.Fragment>
            {
                loading ? <Spinner /> :
                    <div className="item">
                        <div className="item-wrap">
                            <div className="item-img">
                                <img src={nft.token_data ? nft.token_data.image : ''} alt=""></img>
                            </div>
                            <div className="item-info">
                                <p>{nft.token_data ? nft.token_data.name : ''}</p>
                                <div className="d-flex">
                                    {isItemOwner ?
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => showSendBlock()}>
                                                Send
                                            </button>
                                            <div className="input-group" style={disabled ? { display: 'none' } : { display: 'flex' }}>
                                                <input type="text"
                                                    className="form-control"
                                                    placeholder="Enter ether wallet address"
                                                    onChange={(event) => setSendAddress(event.target.value)}
                                                />
                                                <div className="input-group-append">
                                                    <button onClick={onSendPressed} className="btn btn-success" type="button">Confirm</button>
                                                </div>
                                            </div>
                                        </div>
                                        :tokenPrice > 0?
                                        <button type="button" onClick={onBuyPressed} className="btn btn-primary">Buy for {tokenPrice} {tokenPriceUnit}</button>:''
                                    }
                                </div>
                                <div className="status" id="status" style={{ color: "red" }}>
                                    {sendStatus}
                                </div>
                                <div className="d-flex">
                                    {isItemOwner ?
                                        <div>
                                            <button type="button" onClick={onDisallowBuyPressed} className="btn btn-primary">Disallow Buy</button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => showPriceBlock()}>
                                                Allow Buy
                                            </button>
                                            <div className="input-group" style={disabledPrice ? { display: 'none' } : { display: 'flex' }}>
                                                <input type="text"
                                                    className="form-control"
                                                    placeholder="Enter token price in WEI"
                                                    onChange={(event) => setSendPrice(parseInt(event.target.value))}
                                                />
                                                <div className="input-group-append">
                                                    <button className="btn btn-success" onClick={onAllowBuyPressed} type="button">Confirm</button>
                                                </div>
                                            </div>
                                        </div>
                                        :''
                                    }
                                </div>
                                <div className="status" id="status" style={{ color: "pink" }}>
                                    {buyStatus}
                                </div>
                                <div className="item-desc">
                                    <p className="item-desc__owner"><span>Owner: </span>{itemOwner}</p>
                                    <p>Desc</p>
                                    <p className="item-desc__text">{nft.token_data ? nft.token_data.description : ''}</p>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </React.Fragment>
    )
}


export default ItemDetails;