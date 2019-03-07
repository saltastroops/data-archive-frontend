import { canViewPage, isKnownPath } from "../../components/navUtil";

describe("isKnownPath", () => {
  const user = {
    isAdmin: () => true,
    name: "name",
    username: "username"
  };
  it("should be true for known path", () => {
    // Home page AKA search page
    expect(isKnownPath("/", user)).toBeTruthy();
    // Cart
    expect(isKnownPath("/cart", user)).toBeTruthy();
    // User account
    expect(isKnownPath("/account", user)).toBeTruthy();
    // Login
    expect(isKnownPath("/login", user)).toBeTruthy();
    // Registration page
    expect(isKnownPath("/register", user)).toBeTruthy();
    // Date requests page
    expect(isKnownPath("/data-requests", user)).toBeTruthy();
    // Administration page
    expect(isKnownPath("/admin", user)).toBeTruthy();
    // true for trailing "/"
    expect(isKnownPath("/admin/", user)).toBeTruthy();
  });
  it("should be false for unknown path", () => {
    // Home page AKA search page
    expect(isKnownPath("/--", user)).toBeFalsy();
    // Undefine
    let path: any;
    path = undefined;
    expect(isKnownPath(path, user)).toBeFalsy();
    // Unknown
    expect(isKnownPath("/unknown", user)).toBeFalsy();
    // typo name
    expect(isKnownPath("/logins", user)).toBeFalsy();
    // Null
    path = null;
    expect(isKnownPath(path, user)).toBeFalsy();
    // White space
    expect(isKnownPath("\n   \t", user)).toBeFalsy();
    // Special string
    expect(isKnownPath("!@#!@$!$#", user)).toBeFalsy();
  });
});

describe("canViewPage", () => {
  // TODO: more tests when pages have unique users
  it("should be true for any other page except admin", () => {
    const user = {
      isAdmin: () => false,
      name: "name",
      username: "username"
    };
    // Home page AKA search page
    expect(canViewPage("/", user)).toBeTruthy();
    // Cart
    expect(canViewPage("/cart", user)).toBeTruthy();
    // User account
    expect(canViewPage("/account", user)).toBeTruthy();
    // Login
    expect(canViewPage("/login", user)).toBeTruthy();
    // Registration page
    expect(canViewPage("/register", user)).toBeTruthy();
    // Date requests page
    expect(canViewPage("/data-requests", user)).toBeTruthy();
    // Administration page
    expect(canViewPage("/admin", user)).toBeFalsy();
    // true for trailing "/"
    expect(canViewPage("/admin/", user)).toBeFalsy();
  });
  it("should be true fro admin if user is admin ", () => {
    const user = {
      isAdmin: () => true,
      name: "name",
      username: "username"
    };
    // Home page AKA search page
    expect(canViewPage("/admin/", user)).toBeTruthy();
    expect(canViewPage("/admin", user)).toBeTruthy();
  });
});
