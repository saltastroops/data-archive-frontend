import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
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
    // Use mount instead of shallow for better snapshots
    expect(toJson(mount(<ParentGrid />))).toMatchSnapshot();
    expect(toJson(mount(<TargetGrid />))).toMatchSnapshot();
    expect(toJson(mount(<ProposalGrid />))).toMatchSnapshot();
    expect(toJson(mount(<DataGrid />))).toMatchSnapshot();
    expect(toJson(mount(<TelescopeGrid />))).toMatchSnapshot();
    expect(toJson(mount(<ButtonGrid />))).toMatchSnapshot();
    expect(toJson(mount(<MainGrid />))).toMatchSnapshot();
    expect(toJson(mount(<SubGrid />))).toMatchSnapshot();
  });
});
