import React, {useState, useEffect} from 'react';
import FetcherService from "../../util/fetcher";
import './collected.css';
import {getCurrentWalletConnected} from "../../util/interact";

const Collected = () => {
    const [state, setState]=useState([]);
    let fetcher=new FetcherService();

    useEffect(async () => {
        fetcher.getCollected().then(function (response){
            setState(response);
        });
    }, []);


    let HandleResponse=() => (
        <div className="edit-list">
           {state.map(item => (
                <div className="edit-list-item" key={item.name}>
                    <h2 className="edit-list-item__headline">{item.name}</h2>
                    <img src={item.image} alt="" />
                </div>
            ))}
        </div>
    );


    return (
        <div><HandleResponse/></div>
    );








    let html='';
    let handleResponse=function(response){
        html=<div className="edit-list">
            {response.map(item => (
                <div className="edit-list-item" key={item.name}>
                    <h2 className="edit-list-item__headline">{item.name}</h2>
                </div>
            ))}
        </div>
        return html;
    };
    fetcher.getCollected().then(function (response){
        html=<div className="edit-list">
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