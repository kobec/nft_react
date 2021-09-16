import React, { useState, useEffect } from 'react';
import FetcherService from "../../util/fetcher";
import Spinner from '../Spinner/spinner';
import { Link } from 'react-router-dom'
import './collected.css';

const Collected = () => {

    const [nft, seNft] = useState([]);
    const [loading, setLoading] = useState(true);
    let fetcher = new FetcherService();

    useEffect(async () => {
        fetcher.getCollected().then(function (response) {
            seNft(response);
            setLoading(false);
        });
    }, []);


    let HandleResponse = () => (
        <div className="nft-list">
            {nft.map(item => (
                <div className="nft-item" key={item.name}>
                    <div className="nft-item-img">
                        <img className="nft-item__img" src={item.image} alt="" />
                    </div>
                    <h2 className="nft-item__headline">{item.name}</h2>
                    <p className="nft-item__desc">Desc</p>
                    <Link to={{
                        pathname: '/assets',
                        item: nft
                    }} className="nft-item__link">Link</Link>
                </div>
            ))}
        </div>
    );

    const spinner = loading ? <Spinner /> : null;
    const hasData = !loading ? <HandleResponse /> : null;

    return (
        <div>
            {spinner}
            {hasData}
        </div>
    );
};

export default Collected;