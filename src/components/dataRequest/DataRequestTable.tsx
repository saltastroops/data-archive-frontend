import * as React from "react";
import styled from "styled-components";
import DataRequestTableRow from "./DataRequestTableRow";

/**
 * Properties of the data request table component.
 *
 * Properties:
 * -----------
 * dataFiles:
 *    Contains the requested observations files
 * madeAt:
 *    The date the request was issued
 * mayDownloadAll:
 *    Enables the user to download all the requested data at once given that all requested data is available
 * reRequestAll:
 *    Enables the user to re-request all the requested data at once given that all requested data has failed
 */
interface IDataRequestTable {
  dataFiles: any[];
  madeAt: string;
  mayDownloadAll: boolean;
  reRequestAll: boolean;
}

const RequestedDataTable = styled.table.attrs({
  className: "table is-striped is-narrowed is-hoverable is-fullwidth"
})`
  && {
  }
`;

/**
 * A table displaying the con tent of a data request.
 */
class DataRequestTable extends React.Component<IDataRequestTable> {
  render() {
    const { dataFiles, madeAt, mayDownloadAll, reRequestAll } = this.props;

    return (
      <RequestedDataTable>
        <thead>
          <tr>
            <th colSpan={3}>
              <p style={{ display: "inline-block" }}>Requested {madeAt}</p>
              <p
                style={{
                  display: "inline-block",
                  position: "absolute",
                  right: 0
                }}
              >
                {mayDownloadAll ? (
                  <button className="button is-small is-success is-rounded">
                    Download all
                  </button>
                ) : reRequestAll ? (
                  <button className="button is-small is-danger is-rounded">
                    Re-request all
                  </button>
                ) : null}
              </p>
            </th>
          </tr>
          <tr>
            <th>Observation</th>
            <th>Status</th>
            <th>Files</th>
          </tr>
        </thead>
        <tbody>
          {dataFiles.map((observation: any) => {
            let { status } = observation;
            let downloadButton = false;
            let reRequestButton = false;
            // Converting the status for meaningful display
            switch (status) {
              case "SUCCESSFUL":
                status = "Available";
                downloadButton = true;
                break;
              case "FAILED":
                status = "Failed";
                reRequestButton = true;
                break;
              default:
                status = "Pending...";
                break;
            }

            return (
              <DataRequestTableRow
                key={observation.id}
                observation={observation}
                status={status}
                downloadButton={downloadButton}
                reRequestButton={reRequestButton}
              />
            );
          })}
        </tbody>
      </RequestedDataTable>
    );
  }
}

export default DataRequestTable;
