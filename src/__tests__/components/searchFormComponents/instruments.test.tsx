import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import Bvit from "../../../components/searchFormComponents/instruments/Bvit";
import Hippo from "../../../components/searchFormComponents/instruments/Hippo";
import Hrs from "../../../components/searchFormComponents/instruments/Hrs";
import Rss from "../../../components/searchFormComponents/instruments/Rss";
import Salticam from "../../../components/searchFormComponents/instruments/Salticam";
import Shoc from "../../../components/searchFormComponents/instruments/Shoc";
import SpUpNIC from "../../../components/searchFormComponents/instruments/SpUpNIC";

const onChange = jest.fn();
describe("Grids ", () => {
  it("should render all grids", () => {
    expect(
      shallow(<Bvit bvit={{ errors: {}, name: "BVIT" }} onChange={onChange} />)
    ).toBeDefined();
    expect(
      shallow(
        <Hippo hippo={{ errors: {}, name: "HIPPO" }} onChange={onChange} />
      )
    ).toBeDefined();
    expect(
      shallow(<Hrs hrs={{ errors: {}, name: "HRS" }} onChange={onChange} />)
    ).toBeDefined();
    expect(
      shallow(<Rss rss={{ errors: {}, name: "RSS" }} onChange={onChange} />)
    ).toBeDefined();
    expect(
      shallow(
        <Salticam
          salticam={{ errors: {}, name: "Salticam" }}
          onChange={onChange}
        />
      )
    ).toBeDefined();
    expect(
      shallow(<Shoc shoc={{ errors: {}, name: "SHOC" }} onChange={onChange} />)
    ).toBeDefined();
    expect(
      shallow(
        <SpUpNIC
          spUpNic={{ errors: {}, name: "SpUpNIC" }}
          onChange={onChange}
        />
      )
    ).toBeDefined();
  });

  it("should render all grids correctly", () => {
    // Use mount instead of shallow for better snapshots
    expect(
      toJson(
        shallow(
          <Bvit bvit={{ errors: {}, name: "BVIT" }} onChange={onChange} />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <Hippo hippo={{ errors: {}, name: "HIPPO" }} onChange={onChange} />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(<Hrs hrs={{ errors: {}, name: "HRS" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(<Rss rss={{ errors: {}, name: "RSS" }} onChange={onChange} />)
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <Salticam
            salticam={{ errors: {}, name: "Salticam" }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <Shoc shoc={{ errors: {}, name: "SHOC" }} onChange={onChange} />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <SpUpNIC
            spUpNic={{ errors: {}, name: "SpUpNIC" }}
            onChange={onChange}
          />
        )
      )
    ).toMatchSnapshot();
  });
});
