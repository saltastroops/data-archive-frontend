import { mount, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import { MemoryRouter } from "react-router";

import wait from "waait";
jest.mock("../../../util/cache");
import App from "../../../App";
import SearchForm from "../../../components/searchFormComponents/SearchForm";
import SearchPage from "../../../components/searchFormComponents/SearchPage";
import cache from "../../../util/cache";
import { CART_QUERY } from "../../../util/Cart";
import click from "../../../util/click";

window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    addListener: jest.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeListener: jest.fn()
  };
});

const screenDimensions = { innerHeight: 1000, innerWidth: 1400 };

describe("SearchPage", () => {
  it("should load", () => {
    expect(<SearchPage screenDimensions={screenDimensions} />).toBeDefined();
  });
});
