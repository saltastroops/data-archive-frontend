// TODO: file name need to be renamed and moved to utils directory

/**
 * I oder to redirect users and none users the paths of the application needs to be known.
 *
 * This method return a true is the path is known and there is a component for it else false
 *
 * @param path: String
 *    Current route on the url
 *
 * @return Boolean
 */
export const isKnownPath = (path: string) => {
  const knownPath = [
    "",
    "account",
    "cart",
    "data-requests",
    "register",
    "login",
    "admin"
  ]; // known paths with components for each
  if (!path) {
    return false;
  }
  return knownPath.some(k => k === path.replace(/\//g, ""));
};

/**
 * This method tells if the user is allowed to  view the current page/route or not
 *
 * @param path: String
 *    Current route on the url
 * @param user:  String
 *    The current user of the application or null if no user
 *
 * @return Boolean
 */
export const canViewPage = (path: string, user: any) => {
  /**
   * Since the only page that has restriction is the admin page other pages are available to anyone
   */
  if (path.replace(/\//g, "") === "admin") {
    if (user) {
      return user.isAdmin();
    } else {
      return false;
    }
  }
  return true;
};
