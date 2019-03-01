import { USER_QUERY } from "../graphql/Query";
import { baseAxiosClient } from "./";

/**
 * An API for the Data Archive.
 *
 * auth: {
 *  login
 *    A function responsible for authenticating the user.
 * }
 *
 * user: {
 *  queryUser
 *    A function responsible for retrieving the currently logged in user information
 * }
 */
export default {
  auth: {
    login: async (credentials: { password: string; username: string }) => {
      return await baseAxiosClient().post("/auth/login", {
        password: credentials.password,
        username: credentials.username
      });
    }
  },
  user: {
    queryUser: async () =>
      await baseAxiosClient().post("/", { query: USER_QUERY })
  }
};
