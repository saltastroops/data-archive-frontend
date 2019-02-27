import { shallow } from "enzyme";
import * as React from "react";
import {
  ButtonGrid,
  DataGrid,
  MainGrid,
  ParentGrid,
  ProposalGrid,
  SubGrid,
  TargetGrid,
  TelescopeGrid
} from "../../../components/basicComponents/Grids";

describe("Grids ", () => {
  it("should render all grids", () => {
    // const wrapper = );
    expect(shallow(<ParentGrid />)).toBeDefined();
    expect(shallow(<TargetGrid />)).toBeDefined();
    expect(shallow(<ProposalGrid />)).toBeDefined();
    expect(shallow(<DataGrid />)).toBeDefined();
    expect(shallow(<TelescopeGrid />)).toBeDefined();
    expect(shallow(<ButtonGrid />)).toBeDefined();
    expect(shallow(<MainGrid />)).toBeDefined();
    expect(shallow(<SubGrid />)).toBeDefined();
  });

  it("should render all grids correctly", () => {
    // const wrapper = );
    expect(shallow(<ParentGrid />)).toMatchSnapshot();
    expect(shallow(<TargetGrid />)).toMatchSnapshot();
    expect(shallow(<ProposalGrid />)).toMatchSnapshot();
    expect(shallow(<DataGrid />)).toMatchSnapshot();
    expect(shallow(<TelescopeGrid />)).toMatchSnapshot();
    expect(shallow(<ButtonGrid />)).toMatchSnapshot();
    expect(shallow(<MainGrid />)).toMatchSnapshot();
    expect(shallow(<SubGrid />)).toMatchSnapshot();
  });
});
