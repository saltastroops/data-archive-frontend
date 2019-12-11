import SearchResultsTableColumn from "../../../../components/searchFormComponents/results/ISearchResultsTableColumn";

jest.mock("../../../../util/cache");
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import DataKeys from "../../../../components/searchFormComponents/results/DataKeys";
import SearchResultsTable from "../../../../components/searchFormComponents/results/SearchResultsTable";
import { IObservation } from "../../../../components/searchFormComponents/SearchPage";
import cache from "../../../../util/cache";

// IMPORTANT NOTE
//
// While the snapshot tests in this file pass, they are not particularly
// meaningful, as there does not seem much content in the table DOM recorded
// in the snapshots.

const dummySearchResults: any[] = [
  {
    files: [
      {
        [DataKeys.TARGET_DECLINATION]: -20,
        [DataKeys.DATA_FILE_FILENAME]: "filename-1",
        [DataKeys.DATA_FILE_ID]: "fileID-1",
        [DataKeys.INSTRUMENT_NAME]: "RSS",
        [DataKeys.OBSERVATION_NAME]: "name-1",
        [DataKeys.OBSERVATION_NIGHT]: "2010-01-01",
        [DataKeys.TARGET_RIGHT_ASCENSION]: 20,
        [DataKeys.TARGET_NAME]: "target 001",
        [DataKeys.TELESCOPE_NAME]: "SALT",
        cartContent: {
          id: "fileID-1",
          name: "filename-1",
          observation: { id: "Obs-A", name: "Observation A" },
          target: null
        }
      }
    ],
    id: "obsID-1",
    name: "obs1"
  },
  {
    files: [
      {
        [DataKeys.TARGET_DECLINATION]: -25,
        [DataKeys.DATA_FILE_FILENAME]: "filename-2",
        [DataKeys.DATA_FILE_ID]: "fileID-2",
        [DataKeys.INSTRUMENT_NAME]: "RSS",
        [DataKeys.OBSERVATION_NAME]: "name-2",
        [DataKeys.OBSERVATION_NIGHT]: "2010-01-01",
        [DataKeys.TARGET_RIGHT_ASCENSION]: 5,
        [DataKeys.TARGET_NAME]: "target 002",
        [DataKeys.TELESCOPE_NAME]: "SALT",
        cartContent: {
          id: "fileID-2",
          name: "filename-2",
          observation: { id: "Obs-B", name: "Observation B" },
          target: null
        }
      },
      {
        [DataKeys.TARGET_DECLINATION]: -7,
        [DataKeys.DATA_FILE_FILENAME]: "filename-3",
        [DataKeys.DATA_FILE_ID]: "fileID-3",
        [DataKeys.INSTRUMENT_NAME]: "RSS",
        [DataKeys.OBSERVATION_NAME]: "name-2",
        [DataKeys.OBSERVATION_NIGHT]: "2010-01-01",
        [DataKeys.TARGET_RIGHT_ASCENSION]: 12.45,
        [DataKeys.TARGET_NAME]: "target 003",
        [DataKeys.TELESCOPE_NAME]: "SALT",
        cartContent: {
          id: "fileID-3",
          name: "filename-3",
          observation: { id: "Obs-C", name: "Observation C" },
          target: null
        }
      }
    ],
    id: "obsID-2",
    name: "obs1"
  }
];

const columns: SearchResultsTableColumn[] = [
  { dataKey: "proposal", name: "Proposal", visible: true },
  { dataKey: "pi", name: "Principal Investigator", visible: false },
  { dataKey: "target", name: "Target Name", visible: true }
];

afterAll(() => {
  (cache as any).readQuery.mockReset();
  (cache as any).writeQuery.mockReset();
});

describe("SearchResultsTable", () => {
  afterEach(() => {
    (cache as any).readQuery.mockReset();
    (cache as any).writeQuery.mockReset();
  });

  it("should use real tests rather than this dummy one", () => {
    expect(true).toBeTruthy();
  });

  // it("should render correctly with no cart content", () => {
  //   (cache as any).readQuery.mockImplementation(() => ({ cart: [] }));
  //
  //   const wrapper = mount(
  //     <MockedProvider>
  //       <SearchResultsTable
  //         columns={columns}
  //         maxWidth={900}
  //         searchResults={dummySearchResults}
  //       />
  //     </MockedProvider>
  //   );
  //   expect(
  //     toJson(wrapper.find('[data-test="search-results-table"]'))
  //   ).toMatchSnapshot();
  // });
  //
  // it("should render correctly with cart content", () => {
  //   (cache as any).readQuery.mockImplementation(() => ({
  //     cart: [
  //       { [DataKeys.DATA_FILE_ID]: "fileID-1" },
  //       { [DataKeys.DATA_FILE_ID]: "fileID-1" }
  //     ]
  //   }));
  //
  //   const wrapper = mount(
  //     <MockedProvider>
  //       <SearchResultsTable
  //         columns={columns}
  //         maxWidth={900}
  //         searchResults={dummySearchResults}
  //       />
  //     </MockedProvider>
  //   );
  //   expect(
  //     toJson(wrapper.find('[data-test="search-results-table"]'))
  //   ).toMatchSnapshot();
  // });
  //
  // it("should render correctly with no search results", () => {
  //   (cache as any).readQuery.mockImplementation(() => ({ cart: [] }));
  //
  //   const wrapper = mount(
  //     <MockedProvider>
  //       <SearchResultsTable
  //         columns={columns}
  //         maxWidth={900}
  //         searchResults={[]}
  //       />
  //     </MockedProvider>
  //   );
  //   expect(
  //     toJson(wrapper.find('[data-test="search-results-table"]'))
  //   ).toMatchSnapshot();
  // });
});
