import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import TelescopeForm from "../../../components/searchFormComponents/TelescopeForm";

const onChange = jest.fn();

describe("TelescopeForm", () => {
  const wrapper = mount(
    <TelescopeForm onChange={onChange} telescope={{ telescopes: [] }} />
  );

  it("should be defined", () => {
    expect(wrapper).toBeDefined();
  });

  it("should have a select element with name 'telescope'", () => {
    const telescope = wrapper.find('select[name="telescopes"]');
    expect(telescope).toBeDefined();
  });
  it("should have a select element with name 'instruments'", () => {
    const instruments = wrapper.find('select[name="instruments"]');
    expect(instruments).toBeDefined();
  });
  it("should have a select element with name 'modes'", () => {
    const modes = wrapper.find('select[name="modes"]');
    expect(modes).toBeDefined();
  });
  it("should have a select element with name 'detectorMode'", () => {
    const detectorMode = wrapper.find('select[name="detectorMode"]');
    expect(detectorMode).toBeDefined();
  });
  it("should have a select element with name 'filters'", () => {
    const filters = wrapper.find('select[name="filters"]');
    expect(filters).toBeDefined();
  });
  //  TODO ADD MORE (other elements)
});

describe("Telescope form rendering HRS modes", () => {
  const wrapper = mount(
    <TelescopeForm
      onChange={onChange}
      telescope={{ telescopes: [], instruments: ["HRS"] }}
    />
  );
  it("should render", () => {
    expect(wrapper).toBeDefined();
  });
  it("should have six children if HRS is selected", () => {
    const telescope = wrapper.find("div.select").children();
    expect(telescope.length).toEqual(6);
  });
  it("should have a child with hrsMode ", () => {
    const telescope = wrapper.find('select[name="hrsMode"]');
    expect(telescope).toBeDefined();
  });

  it("should render have HRS Mode selector if HRS is selected", () => {
    const salt = shallow(
      <TelescopeForm
        onChange={onChange}
        telescope={{ telescopes: ["SALT"], instruments: ["HRS"] }}
      />
    );
    expect(salt).toBeDefined();
  });
});

describe("Telescope form rendering", () => {
  it("should render only RSS if RSS is selected", () => {
    const rss = mount(
      <TelescopeForm
        onChange={onChange}
        telescope={{
          instrumentModes: ["MOS", "Fabry Perot"],
          instruments: ["RSS"],
          telescopes: ["SALT"]
        }}
      />
    );
    expect(rss).toBeDefined();
  });

  it("should render correctly", () => {
    expect(
      toJson(
        shallow(
          <TelescopeForm
            onChange={onChange}
            telescope={{
              instrumentModes: ["MOS", "Fabry Perot", "Spectropolarimetry"],
              instruments: ["RSS"],
              telescopes: ["SALT"]
            }}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <TelescopeForm
            onChange={onChange}
            telescope={{ telescopes: ["Lesedi"], instruments: ["SHOC"] }}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <TelescopeForm
            onChange={onChange}
            telescope={{ telescopes: ["SALT"], instruments: ["Salticam"] }}
          />
        )
      )
    ).toMatchSnapshot();
  });
});

// TODO: test state update correctly
// Fail to pass the value to enzyme it always pass what is on the state.
describe("Telescope state can update ", () => {
  // it("should call onChange method with correct arguments", () => {
  //   const wrapper = mount(<TelescopeForm onChange={onChange} telescope={{telescopes:[]}} />);
  //   let value: any;
  //   let event: any;
  //   const telescopeSelect = wrapper.find("div.select");
  //   const telescope = telescopeSelect.find("select[name=\"telescopes\"]");
  //   expect(telescope).toBeDefined();
  //   value = ["SALT", "XXX"];
  //   event = { currentTarget: { value, name: "telescopes" } };
  //   telescope.simulate("change", event);
  //   expect(onChange).toHaveBeenCalled();
  //   expect(onChange).toHaveBeenCalledWith({ telescopes: ["SALT"] });
  //
  //   value = ["Lesedi"];
  //   event = { target: { value, name: "telescopes" } };
  //   telescope.simulate("change", event);
  //   expect(onChange).toHaveBeenCalled();
  //   expect(onChange).toHaveBeenCalledWith({ telescopes: ["All"] });
  // });
});
