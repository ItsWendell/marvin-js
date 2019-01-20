import api from './api-client';
import oauth2 from 'simple-oauth2';
import qs from 'querystring';

class Intra42Client {
    constructor(id, secret, host = 'https://api.intra.42.fr') {
        this.oauth2 = oauth2.create({
            client: {
                id: id,
                secret: secret
            },
            auth: {
                tokenHost: host,
            }
        });
        this.tokens = null;
    }

    authorizeClient = (config = {}) => {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await this.oauth2.clientCredentials.getToken(config);
                this.tokens = this.oauth2.accessToken.create(token).token;
                api.updateAccessToken(this.tokens.access_token);
                resolve(this.tokens);
            } catch (error) {
                reject(error);
            }
        });
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