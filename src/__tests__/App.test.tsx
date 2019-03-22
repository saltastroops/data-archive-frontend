import { mount } from "enzyme";
import * as React from "react";
import wait from "waait";
import App from "../App";
import { MemoryRouter } from "react-router-dom";
import click from "../util/click";

describe("App", () => {
  it("should be defined", () => {
    expect(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    ).toBeDefined();
  });

  it("should render correctly", () => {
    // Use mount for nicer snapshots
    expect(
      mount(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      )
    ).toBeDefined();
  });

  it("should go to the search page if the home link is clicked", async () => {
    // Go to another page
    const wrapper = mount(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    const cartLink = wrapper.find('a[href="/cart"]');
    click(cartLink.first());

    await wait(0);
    wrapper.update();

    // No search form is shown any longer.
    expect(wrapper.find("SearchForm").length).toBe(0);

    // Go back to the "home page" again.
    const homeLink = wrapper.find('a[href="/"]');
    click(homeLink.first());

    await wait(0);
    wrapper.update();

    // The search form is shown now.
    expect(wrapper.find("SearchForm").length).not.toBe(0);
  });

  // TODO: Add tests for links to other pages.
});
