require('dotenv').config();//todo: it does not work with Encore, so env is configured in webpack.config.js
//const Dotenv = require('dotenv-webpack');
const key = process.env.REACT_APP_PINATA_KEY;
//console.log(key);
const secret = process.env.REACT_APP_PINATA_SECRET;
//console.log(key);
//console.log(secret);
const axios = require('axios');

export const pinJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    return axios
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

        });
};
export const pinFileToIPFS = async(data) => {
    console.log(data);
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    return axios
        .post(url, data, {
            maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
            headers: {
                'Content-Type': 'multipart/form-data; boundary=${data._boundary}',
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
           return {
               success: true,
               pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

        });
};
