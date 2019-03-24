import * as React from "react";
import styled from "styled-components";
import DataRequestTableRow from "./DataRequestTableRow";

/**
 * Properties of the data request table component.
 *
 * Properties:
 * -----------
 * dataRequest:
 *    Data request whose content is displayed.
 */
interface IDataRequestTableProps {
  dataRequest: any;
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
class DataRequestTable extends React.Component<IDataRequestTableProps> {
  render() {
    const { parts, madeAt } = this.props.dataRequest;

    const mayDownloadAll = parts.every(
      (part: any) => part.status === "SUCCESSFUL"
    );

    const reRequestAll = parts.every((part: any) => part.status !== "PENDING");

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
          {parts.map((part: any) => {
            return <DataRequestTableRow key={part.id} dataRequestPart={part} />;
          })}
        </tbody>
      </RequestedDataTable>
    );
  }
}

export default DataRequestTable;
