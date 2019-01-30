import { EventEmitter } from 'events';
import APIOAuthClient from './api-client';

class Intra42Client extends EventEmitter {
    constructor(id, secret, host = 'https://api.intra.42.fr') {
        super();
        this.api = new APIOAuthClient(id, secret, host);
    }

    authorizeClient = (config = {}) => {
        return this.api.authorizeClient(config);
    }

    getCoalitions() {
        return new Promise((resolve, reject) => {
            this.api.get('/coalitions')
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
            this.api.get('/blocs', { params })
                .then(({ data }) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    getUser(userId) {
        return this.get(`/users/${userId}`);
    }

    get(path, params = {}) {
        return new Promise((resolve, reject) => {
            this.api.get(path, { params })
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