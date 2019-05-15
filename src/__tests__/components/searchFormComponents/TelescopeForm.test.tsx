import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import BVIT from "../../../components/searchFormComponents/instruments/BVIT";
import RSS from "../../../components/searchFormComponents/instruments/RSS";
import SHOC from "../../../components/searchFormComponents/instruments/SHOC";
import TelescopeForm from "../../../components/searchFormComponents/TelescopeForm";
import LesediForm from "../../../components/searchFormComponents/telescopes/LesediForm";
import OneNineMForm from "../../../components/searchFormComponents/telescopes/OneNineMForm";
import SaltForm from "../../../components/searchFormComponents/telescopes/SaltForm";

const onChange = jest.fn();

describe("TelescopeForm", () => {
  const wrapper = mount(<TelescopeForm onChange={onChange} telescope={{}} />);

  it("should be defined", () => {
    expect(wrapper).toBeDefined();
  });

  it("should have a select element with name 'telescope'", () => {
    const telescope = wrapper.find('select[name="telescope"]');
    expect(telescope).toBeDefined();
  });

  it("should have only one child if no telescope is selected", () => {
    const telescope = wrapper.find("div.select").children();
    expect(telescope.length).toEqual(1);
  });

  it("should have two children if a telescope is selected", () => {
    const teleWrapper = mount(
      <TelescopeForm onChange={onChange} telescope={{ name: "SALT" }} />
    );
    const telescope = teleWrapper.find("div.select").children();
    expect(telescope.length).toEqual(2);
  });
});

describe("Telescope form rendering instrument", () => {
  const wrapper = mount(
    <TelescopeForm onChange={onChange} telescope={{ name: "SALT" }} />
  );
  it("should render", () => {
    expect(wrapper).toBeDefined();
  });
  it("should have two children if telescope is selected", () => {
    const telescope = wrapper.find("div.select").children();
    expect(telescope.length).toEqual(2);
  });
  it("should have second child with name instrument ", () => {
    const telescope = wrapper
      .find("div.select")
      .children()
      .get(1);
    expect(telescope).toBeDefined();
    expect(telescope.props.name).toEqual("instrument");
  });

  it("should render have SALT Form if salt is selected", () => {
    const salt = shallow(
      <TelescopeForm onChange={onChange} telescope={{ name: "SALT" }} />
    );
    expect(salt).toBeDefined();
    expect(salt.find(SaltForm).exists()).toBeTruthy();

    // only SaltForm is rendered
    expect(salt.find(OneNineMForm).exists()).toBeFalsy();
    expect(salt.find(LesediForm).exists()).toBeFalsy();
  });
  it("should render have respective form for respective telescope", () => {
    const salt = shallow(
      <TelescopeForm onChange={onChange} telescope={{ name: "SALT" }} />
    );
    const lesedi = shallow(
      <TelescopeForm onChange={onChange} telescope={{ name: "Lesedi" }} />
    );
    const oneNine = shallow(
      <TelescopeForm onChange={onChange} telescope={{ name: "1.9 m" }} />
    );

    expect(salt).toBeDefined();
    expect(lesedi).toBeDefined();
    expect(oneNine).toBeDefined();

    expect(salt.find(SaltForm).exists()).toBeTruthy();
    expect(lesedi.find(LesediForm).exists()).toBeTruthy();
    expect(oneNine.find(OneNineMForm).exists()).toBeTruthy();

    // Should not be rendered
    expect(salt.find(OneNineMForm).exists()).toBeFalsy();
    expect(lesedi.find(OneNineMForm).exists()).toBeFalsy();
    expect(salt.find(LesediForm).exists()).toBeFalsy();
    expect(oneNine.find(LesediForm).exists()).toBeFalsy();
    expect(lesedi.find(SaltForm).exists()).toBeFalsy();
    expect(oneNine.find(SaltForm).exists()).toBeFalsy();
  });
});

describe("Telescope form rendering", () => {
  const wrapper = mount(
    <TelescopeForm
      onChange={onChange}
      telescope={{ name: "SALT", instrument: { name: "RSS" } }}
    />
  );

  it("should render only RSS if RSS is selected", () => {
    const rss = mount(
      <TelescopeForm
        onChange={onChange}
        telescope={{ name: "SALT", instrument: { name: "RSS" } }}
      />
    );
    expect(rss).toBeDefined();
    expect(rss.find(RSS).exists()).toBeTruthy();

    // only RSS is rendered
    expect(rss.find(SHOC).exists()).toBeFalsy();
    expect(rss.find(BVIT).exists()).toBeFalsy();
  });

  it("should render correctly", () => {
    expect(
      toJson(
        shallow(
          <TelescopeForm
            onChange={onChange}
            telescope={{ name: "SALT", instrument: { name: "RSS" } }}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <TelescopeForm
            onChange={onChange}
            telescope={{ name: "Lesedi", instrument: { name: "SHOC" } }}
          />
        )
      )
    ).toMatchSnapshot();
    expect(
      toJson(
        shallow(
          <TelescopeForm
            onChange={onChange}
            telescope={{ name: "SALT", instrument: { name: "HRS" } }}
          />
        )
      )
    ).toMatchSnapshot();

    expect(
      toJson(
        shallow(
          <TelescopeForm
            onChange={onChange}
            telescope={{
              instrument: { name: "RSS", mode: "Fabry Perot" },
              name: "SALT"
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
            telescope={{
              instrument: {
                detectorMode: "Normal",
                mode: "Fabry Perot",
                name: "RSS"
              },
              name: "SALT"
            }}
          />
        )
      )
    ).toMatchSnapshot();
  });
});

// TODO: test state update correctly
describe("Telescope state can update ", () => {
  it("should call onChange method with correct arguments", () => {
    const wrapper = mount(<TelescopeForm onChange={onChange} telescope={{}} />);
    let value: any;
    let event: any;
    const telescopeSelect = wrapper.find("div.select");
    const telescope = telescopeSelect.find("select");
    value = "SALT";
    event = { target: { value, name: "telescope" } };
    telescope.simulate("change", event);
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith({ name: "SALT" });

    value = "Lesedi";
    event = { target: { value, name: "telescope" } };
    telescope.simulate("change", event);
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith({ name: "Lesedi" });
  });
});
