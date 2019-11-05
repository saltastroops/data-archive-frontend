import moment from "moment";
import * as React from "react";
import styled from "styled-components";
import { IDataRequest } from "./DataRequestsForm";

/**
 * Properties of the data request table component.
 *
 * Properties:
 * -----------
 * dataRequest:
 *    Data request whose content is displayed.
 */
interface IDataRequestTableProps {
  dataRequest: IDataRequest;
}

const Table = styled.table.attrs({
  className: "table is-striped is-narrowed is-hoverable is-fullwidth"
})`
  && {
  }
`;

/**
 * The string to display for the creation date.
 *
 * If the date lies within the past 24 hours, the difference from now (such as
 * "5 seconds ago" or "17 hours ago") is returned. Otherwise the time is
 * returned as date and time (such as "on 21 Feb 2019 at 2:16").
 *
 * Parameters
 * ----------
 * madeAt:
 *    The creation date as a string that can be parsed by MomentJS.
 */
const displayedTime = (madeAt: string) => {
  const t = moment(madeAt);
  if (Date.now() - t.valueOf() < 24 * 3600 * 1000) {
    return t.fromNow();
  } else {
    return `on ${t.format("D MMM YYYY")} at ${t.format("k:mm")}`;
  }
};

/**
 * A table displaying the content of a data request.
 */
class DataRequestTable extends React.Component<IDataRequestTableProps> {
  render() {
    const { dataFiles, madeAt, id, status } = this.props.dataRequest;

    const mayDownloadAll = status === "SUCCESSFUL";

    const reRequestAll = status === "FAILED";

    const pending = status === "PENDING";

    // TO UPDATE
    const filename = `data_request_${id}.zip`;

    return (
      <Table>
        <thead>
          <tr>
            <th colSpan={3}>
              <p style={{ display: "inline-block" }}>
                Requested {displayedTime(madeAt)}
              </p>
              <p
                style={{
                  display: "inline-block",
                  position: "absolute",
                  right: 0
                }}
              >
                {mayDownloadAll && (
                  <a
                    className="button download-all is-small is-success is-rounded"
                    href={`${
                      process.env.REACT_APP_BACKEND_URI
                    }/downloads/data-requests/${id}/${filename}`}
                  >
                    Download all
                  </a>
                )}
                {reRequestAll && (
                  <button className="button re-request-all is-small is-danger is-rounded">
                    Re-request all
                  </button>
                )}
                {pending && <span className="request-pending">Pending</span>}
              </p>
            </th>
          </tr>
          <tr>
            <th>Files</th>
          </tr>
          {dataFiles.map(file => (
            <tr key={file.id}>
              <td>{file.name}</td>
            </tr>
          ))}
        </thead>
        <tbody />
      </Table>
    );
  }
}

export default DataRequestTable;
