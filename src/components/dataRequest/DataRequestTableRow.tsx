import * as React from "react";
import { IDataFile, IDataRequestPart } from "./DataRequestsForm";

/**
 * Props of the data request table row component.
 *
 * Properties:
 * -----------
 * dataRequestPart:
 *     Part of the data request displayed in the row.
 */

interface IDataRequestTableRowProps {
  dataRequestPart: IDataRequestPart;
}

/**
 * A row in the data request table.
 */
class DataRequestTableRow extends React.Component<IDataRequestTableRowProps> {
  render() {
    const { dataFiles, status, uri } = this.props.dataRequestPart;
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
        <td>{dataFiles[0].observation.name}</td>
        <td>
          <p>{statusText}</p>
          <p>
            {downloadButton && (
              <a
                className="button download is-small is-success is-rounded"
                href={uri}
              >
                Download
              </a>
            )}
            {reRequestButton && (
              <button className="button re-request is-small is-danger is-rounded">
                Re-request
              </button>
            )}
          </p>
        </td>
        <td>
          <ul>
            {dataFiles.map((file: IDataFile) => {
              return <li key={file.id}>{file.name}</li>;
            })}
          </ul>
        </td>
      </tr>
    );
  }
}

export default DataRequestTableRow;
