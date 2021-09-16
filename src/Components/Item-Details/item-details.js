import React from 'react';
import './item-details.css';

const itemDetails = (props) => {

    const { item } = props.location.state

    return (
        <div className="item">
            <div className="item-wrap">
                <div className="item-img">
                    <img src="" alt=""></img>
                </div>
                <div className="item-name">
                    <p>Name</p>
                    <p>{item}</p>
                </div>
            </div>
            <div className="">
                <p>Desc</p>
            </div>
        </div>
    );
}

export default itemDetails;