import * as React from "react";

/**
 * Props of the data request table row component.
 *
 * Properties:
 * -----------
 * observation:
 *    The requested observation with it files
 * status:
 *    Whether an obsertion is pending, successfull or failed
 * downloadButton:
 *    Enables the download button
 * reRequestButton:
 *    Enables the re-request button
 */

interface IDataRequestTable {
  observation: any;
  status: string;
  downloadButton: boolean;
  reRequestButton: boolean;
}

/**
 * A row in the data request table.
 */
class DataRequestTableRow extends React.Component<IDataRequestTable> {
  render() {
    const { observationFiles } = this.props.observation;
    const { downloadButton, reRequestButton, status } = this.props;

    return (
      <tr>
        <td>{observationFiles[0].observation.id}</td>
        <td>
          <p>{status}</p>
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
            {observationFiles.map((file: any) => {
              return <li key={file.id}>{file.name}</li>;
            })}
          </ul>
        </td>
      </tr>
    );
  }
}

export default DataRequestTableRow;
