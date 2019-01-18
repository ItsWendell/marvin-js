import axios from 'axios';
import qs from 'qs';

const API_HOST = 'https://api.intra.42.fr/v2';

/**
 * Create a preconfigured axios instance to use in all api calls.
 */
const api = axios.create({
	baseURL: API_HOST,
	paramsSerializer: (params) => {
		return qs.stringify(params, { encode: false });
	}
});

/**
 * Update the api axios instance with the latest access token.
 *
 * @param  {string?} token
 * @param  {string}  [type='Bearer']
 * @return {void}
 */
api.updateAccessToken = (token, type = 'Bearer') => {
	if (token) {
		api.defaults.headers.common.Authorization = `${type} ${token}`;
	} else {
		delete api.defaults.headers.common.Authorization;
	}
};

export default api;