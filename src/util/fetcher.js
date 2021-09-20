require('dotenv').config();
export default class FetcherService {

    _apiBase = process.env.REACT_APP_API_BASE;

    getResource = async (url) => {
        const res = await fetch(`${this._apiBase}${url}`);

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

    getNftItem = async (contract_address, token_id) => {
        const res = await this.getResource(`/assets/${contract_address}/${token_id}`);
        return res;
    };

};