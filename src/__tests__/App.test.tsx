import { mount } from "enzyme";
import * as React from "react";
import wait from "waait";
import App from "../App";
import { MemoryRouter } from "react-router-dom";
import { Route } from "react-router-dom";

describe("App", () => {
  it("should be defined", () => {
    expect(<App />).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount for nicer snapshots
    expect(mount(<App />)).toBeDefined();
  });

  it("should go to the search page if the home link is clicked", async () => {
    // Go to another page
    const wrapper = mount(<App />);
    const cartLink = wrapper.find('NavLink[to="/cart"]');
    cartLink.first().simulate("click");

    await wait(0);
    wrapper.update();

    expect(wrapper.find("SearchForm").length).toBe(0);

    const homeLink = wrapper.find('a[href="/"]');
    homeLink.first().simulate("click");

    await wait(0);
    wrapper.update();

    expect(wrapper.find("SearchForm").length).not.toBe(0);
  });

  // TODO: Add tests for links to other pages.
});
