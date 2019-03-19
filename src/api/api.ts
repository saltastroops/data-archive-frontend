import { USER_QUERY } from "../graphql/Query";
import { baseAxiosClient } from "./";

/**
 * An API for the Data Archive.
 *
 * auth: {
 *  login
 *    A function responsible for authenticating the user.
 * }
 */
export default {
  auth: {
    login: async (credentials: { password: string; username: string }) => {
      return baseAxiosClient().post("/auth/login", {
        password: credentials.password,
        username: credentials.username
      });
    }
  }
};
