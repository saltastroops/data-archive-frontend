import axios, { AxiosRequestConfig } from "axios";

/**
 * An axios base client responsible for the HTTP requests.
 *
 * If any of the given configuration parameters clashes with a default one, the
 * given value is used.
 *
 * Parameters
 * ----------
 * config: object
 *     Configuration parameters for the Axios client.
 */
export const baseAxiosClient = (config?: AxiosRequestConfig) => ({
  _client: axios.create(configuration(config)),

  _handleError(error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  },

  get(url: string, conf: AxiosRequestConfig = {}) {
    return this._client.get(url, conf).catch(this._handleError);
  },

  post(url: string, data: any) {
    return this._client.post(url, data).catch(this._handleError);
  },
});

/**
 * Configuration parameters for the Axios client. If the given configuration
 * contains fields of the default configuration, the values of the custom
 * configuration are used.
 *
 * Parameters
 * ----------
 * config: object
 *     Axios configuration.
 */
function configuration(config?: { [key: string]: any }) {
  const defaultConfig = {
    ...config,
    baseURL: `${process.env.REACT_APP_BACKEND_URI}`,
    withCredentials: true,
  };

  return Object.assign({}, defaultConfig, config || {});
}
