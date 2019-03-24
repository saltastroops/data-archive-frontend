import * as React from "react";

/**
 * Props of the data request table row component.
 *
 * Properties:
 * -----------
 * dataRequestPart:
 *     Part of the data request displayed in the row.
 */

interface IDataRequestTableRowProps {
  dataRequestPart: any;
}

/**
 * A row in the data request table.
 */
class DataRequestTableRow extends React.Component<IDataRequestTableRowProps> {
  render() {
    const { dataFiles, status } = this.props.dataRequestPart;
    let downloadButton = false;
    let reRequestButton = false;
    let statusText = "";

    // Converting the status for meaningful display
    switch (status) {
      case "SUCCESSFUL":
        statusText = "Available";
        downloadButton = true;
        break;
      case "FAILED":
        statusText = "Failed";
        reRequestButton = true;
        break;
      case "PENDING":
        statusText = "Pending";
        break;
      case "EXPIRED":
        statusText = "Expired";
        reRequestButton = true;
        break;
      default:
        statusText = "Unknown";
        break;
    }

    return (
      <tr>
        <td>{dataFiles[0].observation.id}</td>
        <td>
          <p>{statusText}</p>
          <p>
            {downloadButton ? (
              <button className="button is-small is-success is-rounded">
                Download
              </button>
            ) : reRequestButton ? (
              <button className="button is-small is-danger is-rounded">
                Re-request
              </button>
            ) : null}
          </p>
        </td>
        <td>
          <ul>
            {dataFiles.map((file: any) => {
              return <li key={file.id}>{file.name}</li>;
            })}
          </ul>
        </td>
      </tr>
    );
  }
}

export default DataRequestTableRow;
