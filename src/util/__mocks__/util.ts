import { IUser } from "../types";

export const mockUser = ({
  authProvider,
  familyName,
  givenName,
  isAdmin
}: IUser) => ({
  authProvider,
  familyName,
  givenName,
  isAdmin
});
