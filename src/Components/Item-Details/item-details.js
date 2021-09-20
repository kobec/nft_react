import React, { useState, useEffect } from 'react';
import FetcherService from '../../util/fetcher';
import './item-details.css';
import { useParams } from "react-router-dom";
import Spinner from '../Spinner/spinner';

const ItemDetails = () => {

    const [nft, setNft] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetcher = new FetcherService();

    useEffect(() => {
        fetcher.getCollected()
            .then((response) => {
                setNft(response.items);
                setLoading(false);
            });
    }, []);

    const { token_id, contract_address } = useParams();

    const selectedNft = nft.find(element => element.contract_address.toLowerCase() === contract_address.toLowerCase() && element.token_id.toLowerCase() === token_id.toLowerCase());

    const RenderItem = () => {
        return (
            <div className="item">
                <div className="item-wrap">
                    <div className="item-img">
                        <img src={selectedNft.token_data.image} alt=""></img>
                    </div>
                    <div className="item-info">
                        <p>{selectedNft.token_data.name}</p>
                        <button type="button" className="btn btn-primary">Buy</button>
                        <button type="button" className="btn btn-secondary">Send</button>
                    </div>
                </div>
                <div className="item-desc">
                    <p>Desc</p>
                    <p className="item-desc__text">{selectedNft.token_data.description}</p>
                </div>
            </div>
        )
    };

    const spinner = loading ? <Spinner /> : null;
    const hasData = !loading ? <RenderItem /> : null;

    return (
        <React.Fragment>
            { spinner}
            { hasData}
        </React.Fragment>
    );
}


export default ItemDetails;