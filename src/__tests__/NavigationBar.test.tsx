import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import * as React from "react";
import { MemoryRouter } from "react-router";
import NavigationBar from "../components/NavigationBar";

const mockUser = (isAdmin: boolean, name: string, username: string) => ({
  isAdmin: () => isAdmin,
  name,
  username
});

describe("NavigationBar", () => {
  it("shows the correct content when the user is not logged in", () => {
    const user = null;
    const logout = jest.fn();
    const wrapper = mount(
      <MemoryRouter>
        <NavigationBar user={user} logout={logout} />
      </MemoryRouter>
    );

    // Login button is shown
    expect(wrapper.exists('Link[to="/login"]')).toBeTruthy();

    // Registration button is shown
    expect(wrapper.exists('Link[to="/register"]')).toBeTruthy();

    // Data requests link is not shown
    expect(wrapper.exists('Link[to="/data-requests"]')).toBeFalsy();

    // Account details link is not shown
    expect(wrapper.exists('Link[to="/account"]')).toBeFalsy();

    // Logout link is not shown
    expect(wrapper.exists('a[data-test="logout"]')).toBeFalsy();

    // Overall content check
    const navigationBar = wrapper.find(".navbar");
    expect(toJSON(navigationBar)).toMatchSnapshot();
  });

  it("shows the correct content when the user is a non-administrator", () => {
    const user = mockUser(false, "name", "username");
    const logout = jest.fn();
    const wrapper = mount(
      <MemoryRouter>
        <NavigationBar user={user} logout={logout} />
      </MemoryRouter>
    );

    // Login button is not shown
    expect(wrapper.exists('Link[to="/login"]')).toBeFalsy();

    // Registration button is not shown
    expect(wrapper.exists('Link[to="/register"]')).toBeFalsy();

    // Data requests link is shown
    expect(wrapper.exists('Link[to="/data-requests"]')).toBeTruthy();

    // Account details link is shown
    expect(wrapper.exists('Link[to="/account"]')).toBeTruthy();

    // Logout link is shown
    expect(wrapper.exists('a[data-test="logout"]')).toBeTruthy();

    // Admin page link is not shown
    expect(wrapper.exists('Link[to="/admin"]')).toBeFalsy();

    // Overall content check
    const navigationBar = wrapper.find(".navbar");
    expect(toJSON(navigationBar)).toMatchSnapshot();
  });

  it("shows the correct content when the user is an administrator", () => {
    const user = mockUser(true, "name", "username");
    const logout = jest.fn();
    const wrapper = mount(
      <MemoryRouter>
        <NavigationBar user={user} logout={logout} />
      </MemoryRouter>
    );

    // Login button is not shown
    expect(wrapper.exists('Link[to="/login"]')).toBeFalsy();

    // Registration button is not shown
    expect(wrapper.exists('Link[to="/register"]')).toBeFalsy();

    // Data requests link is shown
    expect(wrapper.exists('Link[to="/data-requests"]')).toBeTruthy();

    // Account details link is shown
    expect(wrapper.exists('Link[to="/account"]')).toBeTruthy();

    // Logout link is shown
    expect(wrapper.exists('a[data-test="logout"]')).toBeTruthy();

    // Admin page link is shown
    expect(wrapper.exists('Link[to="/admin"]')).toBeTruthy();

    // Overall content check
    const navigationBar = wrapper.find(".navbar");
    expect(toJSON(navigationBar)).toMatchSnapshot();
  });

  it("calls the logout function when the logout link is clicked", () => {
    const user = mockUser(false, "name", "username");
    const logout = jest.fn();
    const wrapper = mount(
      <MemoryRouter>
        <NavigationBar user={user} logout={logout} />
      </MemoryRouter>
    );

    // Click the logout link
    const logoutLink = wrapper.find('a[data-test="logout"]');
    logoutLink.simulate("click");
    expect(logout).toHaveBeenCalled();
  });

  it("toggles the visibility of the menu when the burger button is clicked", async () => {
    const user = mockUser(false, "name", "username");
    const logout = jest.fn();
    const wrapper = mount(
      <MemoryRouter>
        <NavigationBar user={user} logout={logout} />
      </MemoryRouter>
    );

    // The burger button and the menu are not active
    let burger = wrapper.find(".burger");
    let menu = wrapper.find(".navbar-menu");
    expect(burger.hasClass("is-active")).toBeFalsy();
    expect(menu.hasClass("is-active")).toBeFalsy();

    // Click the burger
    burger.simulate("click");

    // The burger button and the menu are active now
    burger = wrapper.find(".burger");
    menu = wrapper.find(".navbar-menu");
    expect(burger.hasClass("is-active")).toBeTruthy();
    expect(menu.hasClass("is-active")).toBeTruthy();

    // Click the burger again
    burger.simulate("click");

    // The burger button and the menu are inactive again
    burger = wrapper.find(".burger");
    menu = wrapper.find(".navbar-menu");
    expect(burger.hasClass("is-active")).toBeFalsy();
    expect(menu.hasClass("is-active")).toBeFalsy();
  });
});
