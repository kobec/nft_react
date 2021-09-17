import React from 'react';
import './item-details.css';

const ItemDetails = () => {

    return (
        <div className="item">
            <div className="item-wrap">
                <div className="item-img">
                    <img src="" alt=""></img>
                </div>
                <div className="item-info">
                    <p>Name</p>
                    <button type="button" className="btn btn-primary">Buy</button>
                    <button type="button" className="btn btn-secondary">Send</button>
                </div>
            </div>
            <div className="item-desc">
                <p>Desc</p>
                <p className="item-desc__text">Some text desc</p>
            </div>
        </div>
    );
}

export default ItemDetails;