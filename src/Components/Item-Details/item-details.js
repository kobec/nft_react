import React, { useState, useEffect } from 'react';
import FetcherService from '../../util/fetcher';
import './item-details.css';
import { useParams } from "react-router-dom";
import { getCurrentWalletConnected, tokenOwner, transferToken } from "../../util/interact.js";
import Spinner from '../Spinner/spinner';

const ItemDetails = () => {

    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [isItemOwner, setIsItemOwner] = useState(false);

    const [sendAddress, setSendAddress] = useState("");

    const [nft, setNft] = useState([]);
    const [loading, setLoading] = useState(true);
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
            });
        });
    }, []);

    const showInputBlock = () => {
        setDisabled(!disabled);
    }

    const onSendPressed = async () => {
        let addrToSent = '0x0D92fD1ffAE469FE04bdCE0b8cBF941C1520A2B0';
        const { success, status } = await transferToken(addrToSent);
        console.log(success, status);
    }

    // const RenderItem = () => {

    return (
        <div className="item">
            <div className="item-wrap">
                <div className="item-img">
                    <img src={nft.token_data ? nft.token_data.image : ''} alt=""></img>
                </div>
                <div className="item-info">
                    <p>{nft.token_data ? nft.token_data.name : ''}</p>
                    <div className="d-flex">
                        <button type="button" className="btn btn-primary">Buy</button>
                        {1 &&
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => showInputBlock()}>
                                    Send
                                </button>
                            </div>
                        }
                    </div>
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
                <div className="item-desc">
                    <p>Desc</p>
                    <p className="item-desc__text">{nft.token_data ? nft.token_data.description : ''}</p>
                </div>
            </div>
        </div>
    )
    // }

    // const spinner = loading ? <Spinner /> : <RenderItem />;

    // return (
    //     <React.Fragment>
    //         {spinner}
    //     </React.Fragment>
    // )
}


export default ItemDetails;