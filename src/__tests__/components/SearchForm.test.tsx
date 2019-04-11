import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MemoryRouter } from "react-router";
import { MockedProvider } from "react-apollo/test-utils";

import wait from "waait";
import App from "../../App";
import SearchForm from "../../components/SearchForm";
import { CART_QUERY } from "../../util/Cart";
import click from "../../util/click";

const mocks = [
  {
    request: {
      query: CART_QUERY,
      variables: {}
    },
    result: {
      data: {
        cart: []
      }
    }
  }
];

describe("Search Form", () => {
  const wrapper = mount(
    <MockedProvider mocks={mocks}>
      <SearchForm />
    </MockedProvider>
  );
  it("should render", () => {
    const wrapper = mount(<SearchForm />);
    expect(wrapper).toBeDefined();
  });

  it("should always render a div of class name grid-container", () => {
    const wrapper = mount(<SearchForm />);
    const mainDiv = wrapper.find("div");
    expect(mainDiv.length).toBeGreaterThan(0);
    const mainContainer = wrapper.find("div.grid-container");
    // expect(mainContainer.length).toEqual(1);
  });

  it("should contain five grid-item and one button", () => {
    const wrapper = mount(<SearchForm />);
    const items = wrapper.find("div.grid-item");
    expect(items.length).toEqual(5);
    const button = wrapper.find("button.is-primary");
    expect(button.length).toEqual(1);
  });

  it("should contain target, proposal, telescope and data form", () => {
    const wrapper = mount(<SearchForm />);
    const target = wrapper.find("div.target-form");
    expect(target.length).toEqual(1);
    const proposal = wrapper.find("div.proposal-form");
    expect(proposal.length).toEqual(1);
    const telescope = wrapper.find("div.telescope-form");
    expect(telescope.length).toEqual(1);
    const data = wrapper.find("div.data-form");
    expect(data.length).toEqual(1);
  });

  it("should update state when typing", () => {
    let value: any;

    const wrapper = mount(<SearchForm />);
    const targetInput = wrapper.find('input[data-test="target-name-input"]');
    const targetName = targetInput.find("input");

    value = "apple";
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.find("SearchForm").state() as any).target.name).toEqual(
      "apple"
    );

    value = "";
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.find("SearchForm").state() as any).target.name).toEqual("");

    value = undefined;
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.find("SearchForm").state() as any).target.name).toEqual("");

    value = null;
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.find("SearchForm").state() as any).target.name).toEqual("");

    value = "\\ \t";
    targetName.simulate("change", { target: { value, name: "name" } });
    expect((wrapper.find("SearchForm").state() as any).target.name).toEqual(
      "\\ \t"
    );
  });

  it("should update state when a selection is changed", () => {
    let value: any;
    const wrapper = mount(<SearchForm />);
    const resolverSelect = wrapper.find('select[data-test="resolver-select"]');
    const resolver = resolverSelect.find("select");
    value = "NED";
    const event = { target: { value, name: "resolver" } };
    resolver.simulate("change", event);
    expect((wrapper.state() as any).target.resolver).toEqual("NED");
  });

  it("should cache values and errors", async () => {
    const wrapper = mount(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Navigate to the search form
    const searchFormLink = wrapper.find('a[href="/"]').first();
    click(searchFormLink);

    await wait(0);
    wrapper.update();

    // Fill in invalid target and general information
    const searchConeRadiusInput = wrapper.find(
      'input[data-test="search-cone-radius-input"]'
    );
    searchConeRadiusInput.simulate("change", {
      target: { value: "invalid radius", name: "searchConeRadius" }
    });
    const observationNightInput = wrapper.find(
      'input[data-test="observation-night-input"]'
    );
    observationNightInput.simulate("change", {
      target: { value: "invalid date", name: "observationNight" }
    });

    // Submit the form
    const submitButton = wrapper.find('button[data-test="search-button"]');
    submitButton.simulate("click");

    await wait(0);
    wrapper.update();

    // The values have been stored in the state, and there are errors
    const searchFormState: any = wrapper.find("SearchForm").state();
    const radiusValue = searchFormState.target.searchConeRadius;
    expect(radiusValue).toEqual("invalid radius");
    const radiusErrorMessage = searchFormState.target.errors.searchConeRadius;
    expect(radiusErrorMessage.length).toBeGreaterThan(0);
    const observationNightValue = searchFormState.general.observationNight;
    expect(observationNightValue).toEqual("invalid date");
    const observationNightErrorMessage =
      searchFormState.general.errors.observationNight;
    expect(observationNightErrorMessage.length).toBeGreaterThan(0);

    // Navigate away from the search form
    const cartLink = wrapper.find('a[href="/cart"]').first();
    click(cartLink);

    await wait(0);
    wrapper.update();

    // No search form any longer
    expect(wrapper.find("SearchForm").length).toBe(0);

    // Navigate back to the search form
    click(searchFormLink);

    await wait(0);
    wrapper.update();

    // The values and errors have been re-inserted.
    const newSearchFormState: any = wrapper.find("SearchForm").state();
    expect(newSearchFormState.target.searchConeRadius).toEqual(radiusValue);
    expect(newSearchFormState.target.errors.searchConeRadius).toEqual(
      radiusErrorMessage
    );
    expect(newSearchFormState.general.observationNight).toEqual(
      observationNightValue
    );
    expect(newSearchFormState.general.errors.observationNight).toEqual(
      observationNightErrorMessage
    );
  });

  it("render correctly", () => {
    const wrapper2 = shallow(
      <MockedProvider mocks={mocks}>
        <SearchForm />
      </MockedProvider>
    );
    expect(toJson(wrapper2.find("SearchForm"))).toMatchSnapshot();
  });
});
