import * as React from "react";
import styled from "styled-components";
import DataKeys from "./DataKeys";
import SearchResultsTableColumn from "./ISearchResultsTableColumn";
import SearchResultsTableColumnGroupSelector from "./SearchResultsTableColumnGroupSelector";

/**
 * Properties for the search results table column selector.
 *
 * columns:
 *     The array of table columns.
 * onChange:
 *     The function to call when a checkbox is clicked. This must implement
 *     changing the column visibility. The function must expect a column's
 *     data key and the new visibility status (true for visible, false for
 *     hidden) as its arguments.
 */
interface ISearchResultsTableColumnSelectorProps {
  closeModal: () => void;
  columns: SearchResultsTableColumn[];
  onChange: (dataKey: string, visible: boolean) => void;
}

const SelectorColumns = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

class SearchResultsTableColumnSelector extends React.Component<
  ISearchResultsTableColumnSelectorProps
> {
  render() {
    const { closeModal, columns, onChange } = this.props;

    const generalDataKeys = [
      DataKeys.PROPOSAL_PI,
      DataKeys.PROPOSAL_TITLE,
      DataKeys.PROPOSAL_TYPE,
      DataKeys.PROPOSAL_CODE,
      DataKeys.OBSERVATION_NIGHT,
      DataKeys.DATA_CATEGORY,
      DataKeys.OBSERVATION_STATUS,
      DataKeys.TELESCOPE_NAME,
      DataKeys.OBSERVATION_PUBLIC_FROM
    ];
    const targetDataKeys = [
      DataKeys.TARGET_NAME,
      DataKeys.TARGET_RIGHT_ASCENSION,
      DataKeys.TARGET_DECLINATION,
      DataKeys.TARGET_TYPE_EXPLANATION
    ];
    const instrumentDataKeys = [
      DataKeys.INSTRUMENT_NAME,
      DataKeys.INSTRUMENT_MODE,
      DataKeys.DETECTOR_MODE,
      DataKeys.SPECTRAL_RESOLUTION,
      DataKeys.MINIMUM_WAVELENGTH,
      DataKeys.MAXIMUM_WAVELENGTH,
      DataKeys.EXPOSURE_TIME,
      DataKeys.POLARIZATION_MODE
    ];
    const saltDataKeys = [
      DataKeys.RSS_FABRY_PEROT_MODE,
      DataKeys.RSS_GRATING,
      DataKeys.HRS_MODE
    ];

    // convert data keys to table columns
    const keysToColumns = (dataKeys: string[]) =>
      dataKeys.map(dataKey => {
        const c = columns.find(column => column.dataKey === dataKey);
        if (c === undefined) {
          throw new Error(`No table column found for data key "${dataKey}".`);
        }
        return c;
      });

    return (
      <div className="modal is-active">
        <div className="modal-background" onClick={closeModal} />
        <div className="modal-card column is-mobile is-half is-offset-one-quarter">
          <header className="modal-card-head">
            <p className="modal-card-title">Columns to show</p>
            <button
              className="delete"
              aria-label="close"
              onClick={closeModal}
            />
          </header>
          <section className="modal-card-body">
            <SelectorColumns>
              <div>
                <SearchResultsTableColumnGroupSelector
                  category="Target"
                  columns={keysToColumns(targetDataKeys)}
                  onChange={onChange}
                />
                <SearchResultsTableColumnGroupSelector
                  category="SALT"
                  columns={keysToColumns(saltDataKeys)}
                  onChange={onChange}
                />
              </div>
              <div>
                <SearchResultsTableColumnGroupSelector
                  category="General"
                  columns={keysToColumns(generalDataKeys)}
                  onChange={onChange}
                />
              </div>
              <div>
                <SearchResultsTableColumnGroupSelector
                  category="Instrument"
                  columns={keysToColumns(instrumentDataKeys)}
                  onChange={onChange}
                />
              </div>
            </SelectorColumns>
          </section>
        </div>
      </div>
    );
  }
}

export default SearchResultsTableColumnSelector;
