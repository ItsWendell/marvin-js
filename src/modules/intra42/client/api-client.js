import { Axios } from 'axios';
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
      paramsSerializer: params => {
        return qs.stringify(params, { encode: false });
      },
      ...httpConfig
    };
    super(defaultConfig);

    // Setting up OAuth2 client
    this.oauth2 = oauth2.create({
      client: {
        id: clientId,
        secret: clientSecret
      },
      auth: {
        tokenHost
      },
      ...oauthConfig
    });

    /** @type {oauth2.AccessToken} */
    this.accessToken = null;

    /**
     * Checks if access token is being refreshed.
     *
     * @type {boolean}
     */
    this.isRefreshingToken = false;

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
  };

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
      this.accessToken = this.oauth2.accessToken.create({});
    }
  };

  /**
   * Sets up interceptors to automatically renew tokens when nessesary.
   */
  setupOAuthInterceptors = () => {
    this.interceptors.request.use(request => {
      if (this.accessToken && this.accessToken.token) {
        const {
          token: { access_token }
        } = this.accessToken;
        request.headers.Authorization = `Bearer ${access_token}`;
        return request;
      }
      return request;
    });

    this.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        const {
          config,
          response: { status }
        } = error;
        const originalRequest = config;
        if (status === 401) {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.authorizeClient()
              .then(accessToken => {
                this.setAccessToken(accessToken);
                this.isRefreshingToken = false;
                this.tokenRequestBuffer.forEach(request => request());
              })
              .catch(e => {
                throw e;
              });
          }

          return new Promise((resolve, reject) => {
            this.tokenRequestBuffer.push(() => {
              const {
                token: { access_token }
              } = this.accessToken;
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              resolve(this.request(originalRequest));
            });
          });
        }
        if (status === 429) {
          return new Promise((resolve, reject) => {
            new Promise(resolveTimeout => setTimeout(resolveTimeout, 500)).then(() => {
              resolve(this.request(originalRequest));
            });
          });
        }
        return Promise.reject(error);
      }
    );
  };
}
