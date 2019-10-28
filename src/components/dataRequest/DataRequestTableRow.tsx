import * as React from "react";
import { IDataFile, IDataRequestObervation } from "./DataRequestsForm";

/**
 * Props of the data request table row component.
 *
 * Properties:
 * -----------
 * dataRequestId:
 *     A data request id which the data request parts belongs to.
 * dataRequestPart:
 *     Part of the data request displayed in the row.
 */

interface IDataRequestTableRowProps {
  dataRequestObservation: IDataRequestObervation;
}

/**
 * A row in the data request table.
 */
class DataRequestTableRow extends React.Component<IDataRequestTableRowProps> {
  render() {
    const { dataFiles, name } = this.props.dataRequestObservation;
    // TO UPDATE
    // const filename = "part-data-file-request.zip";

    // let downloadButton = false;
    // let reRequestButton = false;
    // let statusText = "";

    // // Converting the status for meaningful display
    // switch (status) {
    //   case "SUCCESSFUL":
    //     statusText = "Available";
    //     downloadButton = true;
    //     break;
    //   case "FAILED":
    //     statusText = "Failed";
    //     reRequestButton = true;
    //     break;
    //   case "PENDING":
    //     statusText = "Pending";
    //     break;
    //   case "EXPIRED":
    //     statusText = "Expired";
    //     reRequestButton = true;
    //     break;
    //   default:
    //     statusText = "Unknown";
    //     break;
    // }

    return (
      <tr>
        <td>{name}</td>
        {/*<td>
          <p>{statusText}</p>
          <p>
            {downloadButton && (
              <a
                className="button download is-small is-success is-rounded"
                href={`${
                  process.env.REACT_APP_BACKEND_URI
                }/downloads/data-requests/${dataRequestId}/${id}/${filename}`}
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
            </td>*/}
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
