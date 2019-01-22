import { EventEmitter } from 'events';
import api from './api-client';
import oauth2 from 'simple-oauth2';

class Intra42Client extends EventEmitter {
    constructor(id, secret, host = 'https://api.intra.42.fr') {
        this.oauth2 = 

        // The Simple OAuth2 accessToken helper.
        this.accessToken = null;

        // Check if we are already refreshing tokens.
        this.isRefreshingTokens = false;

        // Requests waiting for new token.
        this.requestBuffer = [];


    }

    getCoalitions() {
        return new Promise((resolve, reject) => {
            api.get('/coalitions')
                .then(({ data }) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    getBlocs(params) {
        return new Promise((resolve, reject) => {
            api.get('/blocs', { params })
                .then(({ data }) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    get(path, params = {}) {
        return new Promise((resolve, reject) => {
            api.get(path, { params })
                .then(({ data }) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

export default Intra42Client;