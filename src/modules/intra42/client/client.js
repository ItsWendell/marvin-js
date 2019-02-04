import { EventEmitter } from 'events';
import APIOAuthClient from './api-client';
import parseLinkHeader from 'parse-link-header';

class Intra42Client extends EventEmitter {
    constructor(id, secret, host = 'https://api.intra.42.fr') {
        super();
        this.api = new APIOAuthClient(id, secret, host);
		this.primaryCampusId = process.env.INTRA42_CAMPUS_ID;ß
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

    getAll(path, params = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                let allData = [];
                const loopPages = true;
                let url = path;
                while (url) {
                    const { data, headers } = await this.api.get(url, { params });
                    allData = allData.concat(data);
                    const links = parseLinkHeader(headers.link);
                    if (links.next && links.next.url) {
                        url = links.next.url;
                    } else {
                        url = false;
                    }
                }
                resolve(allData);
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default Intra42Client;