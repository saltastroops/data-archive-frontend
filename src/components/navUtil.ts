export const isKnownPath = (path: string, user: any) => {
  const knownPath = [
    "",
    "account",
    "cart",
    "data-requests",
    "register",
    "login",
    "admin"
  ];
  console.log("PPP: ", path, !path);
  if (!path) {
    return false;
  }
  return knownPath.some(k => k === path.replace(/\//g, ""));
};

export const canViewPage = (path: string, user: any) => {
  if (path.replace(/\//g, "") === "admin") {
    if (user) {
      return user.isAdmin();
    } else {
      return false;
    }
  }
  return true;
};
