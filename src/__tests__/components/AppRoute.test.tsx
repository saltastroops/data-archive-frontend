import { mount, shallow } from "enzyme";
import * as React from "react";
import { MemoryRouter } from "react-router";
import AppRoute from "../../components/AppRoute";

describe("AppRoute", () => {
  it("should render", () => {
    expect(
      mount(
        <MemoryRouter>
          <AppRoute />
        </MemoryRouter>
      )
    ).toBeDefined();
  });

  /*
   * TODO:
   * This content will change when the correct components are used I am leaving this as a TODO
   * This tests depends on correct components being used.
   */
});
