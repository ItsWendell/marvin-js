import axios, { Axios } from 'axios';
import qs from 'qs';
import oauth2 from 'simple-oauth2';
const API_HOST = 'https://api.intra.42.fr/v2';

/**
 * Axios with integrated + Simple Oauth2 client.
 * @extends Axios
 */
export default class APIOAuthClient extends Axios {
	constructor(clientId, clientSecret, tokenHost, httpConfig = {}, oauthConfig = {}) {
		// Setting up default configuration.
		const defaultConfig = {
			baseURL: API_HOST,
			// Adds support for array get request parameters. 
			paramsSerializer: (params) => {
				return qs.stringify(params, { encode: false });
			},
			...httpConfig,
		};
		super(defaultConfig);

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

		/** 
		 * Checks if access token is being refreshed.
		 * 
		 * @type {boolean} 
		 */
		this.isRefreshingToken = null;

		/**
		 * @type {import('axios').AxiosStatic[]}
		 */
		this.tokenRequestBuffer = [];

		this.setupOAuthInterceptors();
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
				this.setAccessToken(this.oauth2.accessToken.create(token));
				resolve(this.accessToken);
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Sets the accessToken to the class and the client.
	 *
	 * @param {oauth2.AccessToken} accessToken
	 * @return {void}
	 */
	setAccessToken = (accessToken = null) => {
		if (accessToken) {
			this.accessToken = accessToken;
		} else {
			this.accessToken = this.oauth2.accessToken.create();
		}
	}

	/**
	 * Sets up interceptors to automatically renew tokens when nessesary.
	 */
	setupOAuthInterceptors = () => {
		this.interceptors.request.use((request) => {
			const { token: { access_token } } = this.accessToken;
			request.headers['Authorization'] = `Bearer ${access_token}`;
			return reqest;
		}, (error) => {
			const requestConfig = error.config;
			console.log('request error', error.response);
			if (error.response.status === 401) {
				console.log('Ohoh 401 Oauth error.');
				if (!this.isRefreshingTokens) {
					console.log('Trying to auto refresh..');
					this.isRefreshingTokens = true;
					this.accessToken.refresh()
						.then((accessToken) => {
							this.setAccessToken(accessToken);
							this.isRefreshingToken = false;
							console.log('refreshed token.');
							this.tokenRequestBuffer.forEach(request =>
								request()
							);
						})
						.catch((error) => {
							throw error;
						});
				}

				return new Promise((resolve, reject) => {
					this.tokenRequestBuffer.push(() => {
						const { token: { access_token } } = this.accessToken;
						request.headers['Authorization'] = `Bearer ${access_token}`;
						console.log('Resending tokens with', access_token);
						resolve(this.request(requestConfig));
					});
				});
			}
			return Promise.reject(error);
		});
	}
}
