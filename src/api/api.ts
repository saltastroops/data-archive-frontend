import { baseAxiosClient } from "./";

/**
 * An API for the Data Archive.
 *
 * login
 *   A function responsible for authenticating the user.
 */
export default {
  login: async (credentials: { password: string; username: string }) => {
    return baseAxiosClient().post("/auth/login", {
      password: credentials.password,
      username: credentials.username
    });
  }
};
