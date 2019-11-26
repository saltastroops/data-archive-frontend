import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router";
import wait from "waait";
import NavigationBar from "../components/NavigationBar";
import { LOGOUT_MUTATION } from "../graphql/Mutations";
import { USER_QUERY } from "../graphql/Query";

const mockUser = (familyName: string, givenName: string, isAdmin: boolean) => ({
  familyName,
  givenName,
  isAdmin
});

describe("NavigationBar", () => {
  it("shows the correct content when the user is not logged in", () => {
    const user = null;

    const wrapper = mount(
      <MockedProvider>
        <MemoryRouter>
          <NavigationBar user={user} />
        </MemoryRouter>
      </MockedProvider>
    );

    // Login button is shown
    expect(wrapper.exists('Link[to="/login"]')).toBeTruthy();

    // Registration button is shown
    expect(wrapper.exists('Link[to="/register"]')).toBeTruthy();

    // Data requests link is not shown
    expect(wrapper.exists('Link[to="/data-requests"]')).toBeFalsy();

    // Logout link is not shown
    expect(wrapper.exists('a[data-test="logout"]')).toBeFalsy();

    // Admin page link is not shown
    expect(wrapper.exists('Link[to="/admin"]')).toBeFalsy();

    // Overall content check
    const navigationBar = wrapper.find(".navbar");
    expect(toJSON(navigationBar)).toMatchSnapshot();
  });

  it("shows the correct content when the user is a non-administrator", () => {
    const user = mockUser("surname", "name", false);

    const wrapper = mount(
      <MockedProvider>
        <MemoryRouter>
          <NavigationBar user={user} />
        </MemoryRouter>
      </MockedProvider>
    );

    // Login button is not shown
    expect(wrapper.exists('Link[to="/login"]')).toBeFalsy();

    // Registration button is not shown
    expect(wrapper.exists('Link[to="/register"]')).toBeFalsy();

    // Data requests link is shown
    expect(wrapper.exists('Link[to="/data-requests"]')).toBeTruthy();

    // Account edit link is shown
    expect(wrapper.exists('Link[to="/user-update"]')).toBeTruthy();

    // Logout link is shown
    expect(wrapper.exists('a[data-test="logout"]')).toBeTruthy();

    // Admin page link is not shown
    expect(wrapper.exists('Link[to="/admin"]')).toBeFalsy();

    // Overall content check
    const navigationBar = wrapper.find(".navbar");
    expect(toJSON(navigationBar)).toMatchSnapshot();
  });

  it("shows the correct content when the user is an administrator", () => {
    const user = mockUser("surname", "name", true);

    const wrapper = mount(
      <MockedProvider>
        <MemoryRouter>
          <NavigationBar user={user} />
        </MemoryRouter>
      </MockedProvider>
    );

    // Login button is not shown
    expect(wrapper.exists('Link[to="/login"]')).toBeFalsy();

    // Registration button is not shown
    expect(wrapper.exists('Link[to="/register"]')).toBeFalsy();

    // Data requests link is shown
    expect(wrapper.exists('Link[to="/data-requests"]')).toBeTruthy();

    // Account edit link is shown
    expect(wrapper.exists('Link[to="/user-update"]')).toBeTruthy();

    // Logout link is shown
    expect(wrapper.exists('a[data-test="logout"]')).toBeTruthy();

    // Admin page link is shown
    expect(wrapper.exists('Link[to="/admin"]')).toBeTruthy();

    // Overall content check
    const navigationBar = wrapper.find(".navbar");
    expect(toJSON(navigationBar)).toMatchSnapshot();
  });

  it("calls the logout function when the logout link is clicked", async () => {
    const user = mockUser("surname", "name", false);

    // logout mock mutation
    let logoutCalled = false;
    const mocks = [
      {
        request: {
          query: LOGOUT_MUTATION
        },
        result: () => {
          logoutCalled = true;
          return {
            data: {
              success: true
            }
          };
        }
      },

      {
        request: {
          query: USER_QUERY
        },
        result: {
          data: {
            user: null
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <NavigationBar user={user} />
        </MemoryRouter>
      </MockedProvider>
    );

    // The logout mutation has not been called (yet).
    expect(logoutCalled).toBe(false);

    // Click the logout link
    const logoutLink = wrapper.find('a[data-test="logout"]');
    logoutLink.simulate("click");

    // The logout mutation has been called
    await wait(0);
    wrapper.update();
    expect(logoutCalled).toBe(true);
  });

  it("toggles the visibility of the menu when the burger button is clicked", async () => {
    const user = mockUser("surname", "name", false);

    const wrapper = mount(
      <MockedProvider>
        <MemoryRouter>
          <NavigationBar user={user} />
        </MemoryRouter>
      </MockedProvider>
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
