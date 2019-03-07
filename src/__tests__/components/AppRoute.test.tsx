import { mount } from "enzyme";
import * as React from "react";
import AppRoute from "../../components/AppRoute";

describe("AppRoute", () => {
  it("should render", () => {
    expect(mount(<AppRoute />)).toBeDefined();
  });
});
