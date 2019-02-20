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
} from "../../components/basicComponents/Grids";

describe("Styled components Grids ", () => {
  it("should render any Grid", () => {
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
  // it("should match snapshot", () => {
  //   // const wrapper = );
  //   expect(shallow(<ParentGrid />)).toMatchSnapshot();
  //   expect(shallow(<TargetGrid />)).toMatchSnapshot();
  //   expect(shallow(<ProposalGrid />)).toMatchSnapshot();
  //   expect(shallow(<DataGrid />)).toMatchSnapshot();
  //   expect(shallow(<TelescopeGrid />)).toMatchSnapshot();
  //   expect(shallow(<ButtonGrid />)).toMatchSnapshot();
  //   expect(shallow(<MainGrid />)).toMatchSnapshot();
  //   expect(shallow(<SubGrid />)).toMatchSnapshot();
  // });
});
