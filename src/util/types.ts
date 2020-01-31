/**
 * Auth provider types.
 */
export type AuthProvider = "SSDA" | "SDB";

export interface IUser {
  affiliation?: string;
  authProvider: AuthProvider;
  email?: string;
  familyName: string;
  givenName: string;
  isAdmin: boolean;
  username?: string;
}
