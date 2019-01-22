import { Axios, AxiosInstance } from 'axios';
import qs from 'qs';
import oauth2 from 'simple-oauth2';
const API_HOST = 'https://api.intra.42.fr/v2';

/**
 * Axios with integrated + Simple Oauth2 client.
 * @extends AxiosInstance
 */
class APIOAuthClient extends Axios {
	constructor(clientId, clientSecret, tokenHost, httpConfig = {}, oauthConfig = {}) {
		// Setting up default configuration.
		const defaultConfig = {
			baseURL: API_HOST,
			// Adds support for array get request parameters. 
			paramsSerializer: (params) => {
				return qs.stringify(params, { encode: false });
			},
			...instanceConfig,
		};
		super(httpConfig);

		// Setting up OAuth2 client
		this.oauth2 = oauth2.create({
            client: {
                id: clientId,
                secret: clientSecret,
            },
            auth: {
                tokenHost: tokenHost,
			},
			...oauthConfig,
		});

		/** @type {oauth2.AccessToken} */
		this.accessToken = null;
	}

	/**
	 * Authorize with initialized credentials.
	 * 
	 * @param {oauth2.ClientCredentialTokenConfig} 
	 * @returns {Promise<oauth2.AccessToken>}
	 */
	authorizeClient = (config = {}) => {
        return new Promise(async (resolve, reject) => {
            try {
                const token = await this.oauth2.clientCredentials.getToken(config);
                this.accessToken = this.oauth2.accessToken.create(token);
                resolve(this.accessToken);
            } catch (error) {
                reject(error);
            }
        });
	}

	/**
	 * Sets the token header from the oauth2 client.
	 *
	 * @param  {string}  [type='Bearer']
	 * @return {void}
	 */	
	setTokenHeader = () => {
		if (token) {
			this.defaults.headers.common.Authorization = `${type} ${token}`;
		} else {
			delete this.defaults.headers.common.Authorization;
		}
	}

	/**
	 * Sets up interceptors to automatically renew tokens when nessesary.
	 */
	setupOAuthInterceptors = () => {
		this.interceptors.request.use((response) => {
			return response;
		}, (error) => {
			const requestConfig = error.config;
		
			if (error.response.status === 401) {
				if (!api.isRefreshingTokens) {
					api.isRefreshingTokens = true;
					api.accessToken.refresh()
						.then((accessToken) => {
							this.accessToken = accessToken;
							this.updateAccessToken(this.accessToken.access_token);
							isAlreadyFetchingAccessToken = false;
							this.requestBuffer.forEach(request =>
								request(this.accessToken.access_token)
							);
						})
						.catch((error) => {
							console.log(`[Intra42] Error refreshing access token: ${error.message}`);
							throw error;
						});
				}
		
				return new Promise((resolve, reject) => {
					this.requestBuffer.push(access_token => {
						requestConfig.headers.Authorization = 'Bearer ' + access_token
						resolve(api.request(requestConfig));
					});
				});
			}
			return Promise.reject(error);
		});
	}
}
/**
 * Create a preconfigured axios instance to use in all api calls.
 */
const api = axios.create({

});


api.

// Check if access tokens are freshing.
api.isRefreshingTokens = false;

// Setup client to support auto refreshing of client tokens when expired.


export default api;