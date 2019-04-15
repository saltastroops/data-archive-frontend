import { baseAxiosClient } from "./";

/**
 * An API for the Data Archive.
 *
 * login
 *   A function responsible for authenticating the user.
 */
export default {
  /**
   * login
   *   A function responsible for authenticating the user.
   */
  login: async (credentials: { password: string; username: string }) => {
    return baseAxiosClient().post("/auth/login", {
      password: credentials.password,
      username: credentials.username
    });
  },

  /**
   * logout
   *   A function responsible for logging out the user.
   */
  logout: async () => {
    return baseAxiosClient().post("/auth/logout", {});
  }
};
