import React, { useState, useEffect } from 'react';
import FetcherService from '../../util/fetcher';
import './item-details.css';
import { useParams } from "react-router-dom";
import { getCurrentWalletConnected, tokenOwner } from "../../util/interact.js";
import Spinner from '../Spinner/spinner';

const ItemDetails = () => {

    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [isItemOwner, setIsItemOwner] = useState(false);

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

    const RenderItem = () => {


        return (
            <div className="item">
                <div className="item-wrap">
                    <div className="item-img">
                        <img src={nft.token_data.image} alt=""></img>
                    </div>
                    <div className="item-info">
                        <p>{nft.token_data.name}</p>
                        <div className="d-flex">
                            <button type="button" className="btn btn-primary">Buy</button>
                            {isItemOwner &&
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
                            <input type="text" className="form-control" placeholder="Enter email" />
                            <div className="input-group-append">
                                <button className="btn btn-success" type="button">Confirm</button>
                            </div>
                        </div>
                    </div>
                    <div className="item-desc">
                        <p>Desc</p>
                        <p className="item-desc__text">{nft.token_data.description}</p>
                    </div>
                </div>
            </div>
        )
    };

    const spinner = loading ? <Spinner /> : null;
    const hasData = !loading ? <RenderItem /> : null;

    return (
        <React.Fragment>
            {spinner}
            {hasData}
        </React.Fragment>
    );
}


export default ItemDetails;