import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router";

import wait from "waait";
jest.mock("../../../util/cache");
import App from "../../../App";
import SearchForm from "../../../components/searchFormComponents/SearchForm";
import cache from "../../../util/cache";
import { CART_QUERY } from "../../../util/Cart";
import click from "../../../util/click";

window.matchMedia = jest.fn().mockImplementation((query) => {
  return {
    addListener: jest.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeListener: jest.fn(),
  };
});

const mocks = [
  {
    request: {
      query: CART_QUERY,
      variables: { user: "none" },
    },
    result: {
      data: {
        cart: [],
      },
      loading: false,
    },
  },
];

const screenDimensions = { innerHeight: 1000, innerWidth: 1400 };

describe("Search Form", () => {
  it("should render", () => {
    const wrapper = mount(<SearchForm loading={false} search={jest.fn()} />);
    expect(wrapper).toBeDefined();
  });

  it("should always render a div of class name grid-container", () => {
    const wrapper = mount(<SearchForm loading={false} search={jest.fn()} />);
    const mainDiv = wrapper.find("div.grid-container");
    expect(mainDiv.length).toBeGreaterThan(0);
  });

  it("should contain target, proposal, telescope and data form", () => {
    const wrapper = mount(<SearchForm loading={false} search={jest.fn()} />);
    const target = wrapper.find("div.target-form");
    expect(target.length).toEqual(1);
    const proposal = wrapper.find("div.proposal-form");
    expect(proposal.length).toEqual(1);
    const telescope = wrapper.find("div.telescope-form");
    expect(telescope.length).toEqual(1);
  });

  it("should update state when typing", () => {
    let value: any;

    const wrapper = mount(<SearchForm loading={false} search={jest.fn()} />);
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
    const wrapper = mount(<SearchForm loading={false} search={jest.fn()} />);
    const resolverSelect = wrapper.find('select[data-test="resolver-select"]');
    const resolver = resolverSelect.find("select");
    value = "NED";
    const event = { target: { value, name: "resolver" } };
    resolver.simulate("change", event);
    expect((wrapper.state() as any).target.resolver).toEqual("NED");
  });

  it("should cache values and errors", async () => {
    (cache as any).readQuery.mockImplementation(() => ({ cart: [] }));

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MockedProvider>
    );

    // Wait for the user query to finish
    await wait(0);
    wrapper.update();

    // Navigate to the search form
    const searchFormLink = wrapper.find('a[href="/"]').first();

    await wait(0);
    click(searchFormLink);

    await wait(0);
    wrapper.update();

    // Fill in invalid target and general information
    const searchConeRadiusInput = wrapper.find(
      'input[data-test="search-cone-radius-input"]'
    );
    searchConeRadiusInput.simulate("change", {
      target: { value: "invalid radius", name: "searchConeRadius" },
    });
    const observationNightInput = wrapper.find(
      'input[data-test="observation-night-input"]'
    );
    observationNightInput.simulate("change", {
      target: { value: "invalid date", name: "observationNight" },
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
    const loginLink = wrapper.find('a[href="/login"]').first();
    click(loginLink);

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
    const wrapper = shallow(
      <MockedProvider mocks={mocks}>
        <SearchForm loading={false} search={jest.fn()} />
      </MockedProvider>
    );
    expect(toJson(wrapper.find("SearchForm"))).toMatchSnapshot();
  });
});
