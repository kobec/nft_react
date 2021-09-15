import React, { useState, useEffect } from 'react';
import FetcherService from "../../util/fetcher";
import Spinner from '../Spinner/spinner';
import './collected.css';

const Collected = () => {
    const [state, setState] = useState([]);
    const [loading, setLoading] = useState(true);
    let fetcher = new FetcherService();

    useEffect(async () => {
        fetcher.getCollected().then(function (response) {
            setState(response);
            setLoading(false);
        });
    }, []);


    let HandleResponse = () => (
        <div className="nft-list">
            {state.map(item => (
                <div className="nft-item" key={item.name}>
                    <h2 className="nft-item__headline">{item.name}</h2>
                    <p className="nft-item__desc">Desc</p>
                    <a href="#" className="nft-item__link">Link</a>
                    <img className="nft-item__img" src={item.image} alt="" />
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


    let html = '';
    let handleResponse = function (response) {
        html = <div className="edit-list">
            {response.map(item => (
                <div className="edit-list-item" key={item.name}>
                    <h2 className="edit-list-item__headline">{item.name}</h2>
                </div>
            ))}
        </div>
        return html;
    };
    fetcher.getCollected().then(function (response) {
        html = <div className="edit-list">
            {response.map(item => (
                <div className="edit-list-item" key={item.name}>
                    <h2 className="edit-list-item__headline">{item.name}</h2>
                </div>
            ))}
        </div>
        console.log(html);
    });
    /*let collection=fetcher.getCollected().then((response)=>{

    });*/
    return (
        <div>{html}</div>
    );
};

export default Collected;