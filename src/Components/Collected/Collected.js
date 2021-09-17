import React, { useState, useEffect } from 'react';
import Spinner from '../Spinner/spinner';
import { Link } from 'react-router-dom'
import './collected.css';
import FetcherService from "../../util/fetcher";


const Collected = () => {

    const [nft, setNft] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});

    let fetcher = new FetcherService();

    useEffect(async () => {
        fetcher.getCollected()
            .then((response) => {
                setNft(response.items);
                setPagination(response.pagination);
                setLoading(false);
            });
    }, []);

    const HandleResponse = () => {

        console.log("nft: ", nft);

        return (
            <div className="nft-list">
                {nft.map(item => (
                    <div className="nft-item" key={item.id}>
                        <div className="nft-item-img">
                            <img className="nft-item__img" src={item.token_data.image} alt={item.token_data.description} />
                        </div>
                        <h2 className="nft-item__headline">{item.token_data.name}</h2>
                        <p className="nft-item__desc">{item.token_data.description}</p>
                        <Link to={`/assets/${item.contract_address}/${item.token_id}`}
                            className="nft-item__link">
                            Go to Item
                    </Link>
                    </div>
                ))}
            </div>
        )
    };

    const HandlePagination = () => {

        return (
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    <li className="page-item">
                        <a className="page-link" href="#">1</a>
                    </li>
                </ul>
            </nav>
        )
    };

    const spinner = loading ? <Spinner /> : null;
    const hasData = !loading ? <HandleResponse /> : null;

    return (
        <div>
            {spinner}
            {hasData}
            <HandlePagination />
        </div>
    );
};

export default Collected;