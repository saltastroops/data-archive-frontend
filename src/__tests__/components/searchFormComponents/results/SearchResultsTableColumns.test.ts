import DataKeys from "../../../../components/searchFormComponents/results/DataKeys";
import { searchResultsTableColumns } from "../../../../components/searchFormComponents/results/SearchResultsTableColumns";

describe("SearchResultsTableColumns", () => {
  describe("searchResultsTableColumns", () => {
    it("should generate the correct table columns", () => {
      let dbColumns: string[] = [];
      expect(searchResultsTableColumns(dbColumns)).toMatchSnapshot();

      dbColumns = [DataKeys.INSTRUMENT_NAME];
      expect(searchResultsTableColumns(dbColumns)).toMatchSnapshot();

      dbColumns = [
        DataKeys.PROPOSAL_PI_FAMILY_NAME,
        DataKeys.TARGET_TYPE_NUMERIC_CODE,
        DataKeys.TARGET_DECLINATION,
        DataKeys.TELESCOPE_NAME,
        DataKeys.INSTRUMENT_NAME,
        DataKeys.PROPOSAL_CODE,
        DataKeys.TELESCOPE_OBSERVATION_ID,
        DataKeys.TARGET_RIGHT_ASCENSION,
        DataKeys.OBSERVATION_ID
      ];
      expect(searchResultsTableColumns(dbColumns)).toMatchSnapshot();
    });
  });
});
