/**
 * Auth provider types.
 */
export type AuthProvider = "SSDA" | "SDB";

export interface IUser {
  authProvider: AuthProvider;
  familyName: string;
  givenName: string;
  isAdmin: boolean;
}
