import { mount } from "enzyme";
import * as React from "react";
import wait from "waait";
import App from "../App";
import { MemoryRouter } from "react-router-dom";
import { Route } from "react-router-dom";

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
});
