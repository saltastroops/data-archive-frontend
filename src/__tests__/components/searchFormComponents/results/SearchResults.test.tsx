jest.mock("../../../../util/cache");
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import SearchResultsTable from "../../../../components/searchFormComponents/results/SearchResultsTable";
import cache from "../../../../util/cache";

const dummySearchResults = [
  {
    files: [
      {
        category: "cat-5",
        dataType: "type-1",
        declination: -20,
        filename: "filename-1",
        id: "fileID-1",
        instrument: "RSS",
        isReduced: true,
        name: "name-1",
        observationNight: "2010-01-01",
        rightAscension: 20,
        targetName: "target 001",
        telescope: "SALT"
      }
    ],
    id: "obsID-1",
    name: "obs1",
    proposal: "Code-1",
    startTime: "2018-02-02 17:55:23",
    telescope: "SALT"
  },
  {
    files: [
      {
        category: "cat-1",
        dataType: "type-2",
        declination: -25,
        filename: "filename-2",
        id: "fileID-2",
        instrument: "RSS",
        isReduced: true,
        name: "name-2",
        observationNight: "2010-01-01",
        rightAscension: 5,
        targetName: "target 002",
        telescope: "SALT",
        url: "http://demo/image4.jpg"
      },
      {
        category: "cat-1",
        dataType: "type-3",
        declination: -7,
        filename: "filename-3",
        id: "fileID-3",
        instrument: "RSS",
        isReduced: true,
        name: "name-2",
        observationNight: "2010-01-01",
        rightAscension: 12.45,
        targetName: "target 003",
        telescope: "SALT",
        url: "http://demo/image5.jpg"
      }
    ],
    id: "obsID-2",
    name: "obs1",
    proposal: "Code-2",
    startTime: "2018-02-02 17:55:23",
    telescope: "SALT"
  }
];

afterAll(() => {
  (cache as any).readQuery.mockReset();
  (cache as any).writeQuery.mockReset();
});

describe("Search results", () => {
  afterEach(() => {
    (cache as any).readQuery.mockReset();
    (cache as any).writeQuery.mockReset();
  });

  it("should render correctly with no cart content", () => {
    (cache as any).readQuery.mockImplementation(() => ({ cart: [] }));

    const wrapper = mount(
      <MockedProvider>
        <SearchResultsTable
          searchResults={dummySearchResults}
          columns={["cart", "observation", "declination", "rightAscension"]}
        />
      </MockedProvider>
    );
    expect(
      toJson(wrapper.find('[data-test="search-results-table"]'))
    ).toMatchSnapshot();
  });

  it("should render correctly with cart content", () => {
    (cache as any).readQuery.mockImplementation(() => ({
      cart: [{ id: "fileID-1" }, { id: "fileID-1" }]
    }));

    const wrapper = mount(
      <MockedProvider>
        <SearchResultsTable
          searchResults={dummySearchResults}
          columns={["cart", "observation", "declination", "rightAscension"]}
        />
      </MockedProvider>
    );
    expect(
      toJson(wrapper.find('[data-test="search-results-table"]'))
    ).toMatchSnapshot();
  });

  it("should render correctly with no search results", () => {
    (cache as any).readQuery.mockImplementation(() => ({ cart: [] }));

    const wrapper = mount(
      <MockedProvider>
        <SearchResultsTable
          searchResults={[]}
          columns={["cart", "observation", "declination", "rightAscension"]}
        />
      </MockedProvider>
    );
    expect(
      toJson(wrapper.find('[data-test="search-results-table"]'))
    ).toMatchSnapshot();
  });
});
