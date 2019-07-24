import { baseAxiosClient } from "./";

/**
 * An API for the Data Archive.
 *
 * login
 *   A function responsible for authenticating the user.
 */
export default {
  /**
   * Log the user in.
   *
   * Parameters:
   * -----------
   * credentials:
   *     The authentication credentials. They must contain the username and
   *     password, as well as the authentication provider (such as "SSDA" or
   *     "SDB").
   *
   * Returns:
   * --------
   * true
   */
  login: async (credentials: {
    authProvider: string;
    password: string;
    username: string;
  }) => {
    return baseAxiosClient().post("/auth/login", {
      authProvider: credentials.authProvider,
      password: credentials.password,
      username: credentials.username
    });
  },

  /**
   * Log the user out.
   *
   * Returns:
   * --------
   * true
   */
  logout: async () => {
    return baseAxiosClient().post("/auth/logout", {});
  }
};
