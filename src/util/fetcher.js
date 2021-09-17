require('dotenv').config();
export default class FetcherService {
    
    _apiBase = process.env.REACT_APP_API_BASE;

    async getCollected() {
        let url = `${this._apiBase}/collected`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}` +
                `, received ${res.status}`)
        }

        return await res.json();
    };
};