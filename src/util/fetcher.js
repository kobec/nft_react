if (process.env.NODE_ENV === 'local') {
    //require('dotenv').config();
}
export default class FetcherService {

    _apiBase = process.env.REACT_APP_API_BASE;

    getResource = async (url) => {
        const JWTToken = localStorage.getItem('JWTToken');

        if (!JWTToken) {
            window.alert('Error, please log in!');
            window.location.href = '/';
        }

        const res = await fetch(`${this._apiBase}${url}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JWTToken,
            },
            method: 'GET',
        });

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}` +
                `, received ${res.status}`)
        }
        return await res.json();
    };

    getCollected = async () => {
        const res = await this.getResource('/collected');
        return res;
    };

    getCollectedPage = async (id) => {
        const res = await this.getResource(`/collected?page=${id}`);
        return res;
    };

    getNftItem = async (contract_address, token_id) => {
        const res = await this.getResource(`/assets/${contract_address}/${token_id}`);
        return res;
    };

};