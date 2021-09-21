import React, { useState, useEffect } from 'react';
import FetcherService from '../../util/fetcher';
import './item-details.css';
import { useParams } from "react-router-dom";
import { getCurrentWalletConnected, tokenOwner, transferToken } from "../../util/interact.js";
import Spinner from '../Spinner/spinner';

const RenderItem = () => {
    
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");

    const [loading, setLoading] = useState(true);

    const spinner = loading ? <Spinner /> : <RenderItem />;

    const [isItemOwner, setIsItemOwner] = useState(false);
    const [itemOwner, setItemOwner] = useState("");

    const [sendAddress, setSendAddress] = useState("");
    const [sendStatus, setSendStatus] = useState("");

    const [nft, setNft] = useState([]);

    const [disabled, setDisabled] = useState(true);

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
    }, []);

    const showInputBlock = () => setDisabled(!disabled);

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

    return (
        <div className="item">
            <div className="item-wrap">
                <div className="item-img">
                    <img src={nft.token_data ? nft.token_data.image : ''} alt=""></img>
                </div>
                <div className="item-info">
                    <p>{nft.token_data ? nft.token_data.name : ''}</p>
                    <div className="d-flex">
                        {1 ?
                            <div>
                                <button type="button" className="btn btn-primary">Buy</button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={showInputBlock}>
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
                            :
                            <button type="button" className="btn btn-primary">Buy</button>
                        }
                    </div>
                    <div className="status" id="status" style={{ color: "red" }}>
                        {sendStatus}
                    </div>
                    <div className="item-desc">
                        <p className="item-desc__owner"><span>Owner: </span>{itemOwner}</p>
                        <p>Desc</p>
                        <p className="item-desc__text">{nft.token_data ? nft.token_data.description : ''}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ItemDetails = () => {

    return (
        <React.Fragment>
            <RenderItem />
        </React.Fragment>
    )
}


export default ItemDetails;