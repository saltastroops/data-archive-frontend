import { mount } from "enzyme";
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
});
