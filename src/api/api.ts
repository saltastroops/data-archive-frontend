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
   *     password.
   *
   * Returns:
   * --------
   * true if the user has been logged in, error otherwise.
   */
  login: async (credentials: { password: string; username: string }) => {
    return baseAxiosClient().post("/auth/login", {
      password: credentials.password,
      username: credentials.username
    });
  },

  /**
   * Log the user out.
   *
   * Returns:
   * --------
   * true if the user has been logged out, error otherwise.
   */
  logout: async () => {
    return baseAxiosClient().post("/auth/logout", {});
  }
};
