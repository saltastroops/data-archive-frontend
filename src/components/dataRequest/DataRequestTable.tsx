import moment from "moment";
import * as React from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import { titleCase } from "title-case";
import { CREATE_DATA_REQUEST } from "../../graphql/Mutations";
import { USER_DATA_REQUESTS_QUERY } from "../../graphql/Query";
import { IDataRequest } from "./DataRequestsForm";

/**
 * Convert the name to title case
 *
 * Properties:
 * -----------
 * word:
 *    The string to be converted
 *
 * Returns:
 * --------
 * string :
 *  Title case string
 *
 */
const convertToTitleCase = (word: string) => {
  return titleCase(word.toLowerCase().replace(/_/g, " "));
};
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

const Button = styled.button.attrs({
  className: "button re-request-all is-small is-danger is-rounded"
})`
  && {
    margin-left: 10px;
  }
`;

const ErrorMessage = styled.p.attrs({
  className: "error tile"
})`
  && {
    text-align: left;
    margin: 3px 0 3px 0;
    padding: 2px 0 2px 0;
    background-color: hsl(348, 100%, 61%);
    color: white;
  }
`;

/**
 * The string to display for the creation date.
 *
 * The time is returned as date and time (such as "on 21 Feb 2019 at 2:16").
 *
 * Parameters
 * ----------
 * madeAt:
 *    The creation date as a string that can be parsed by MomentJS.
 */
const displayedTime = (madeAt: string) => {
  const t = moment(madeAt);
  return `on ${t.format("D MMM YYYY")} at ${t.format("k:mm")}`;
};

/**
 * A table displaying the content of a data request.
 */
class DataRequestTable extends React.Component<IDataRequestTableProps> {
  render() {
    const {
      dataFiles,
      madeAt,
      id,
      status,
      calibrationLevels,
      calibrationTypes
    } = this.props.dataRequest;
    const mayDownloadAll = status === "SUCCESSFUL";

    const tryAgain = status === "FAILED";

    const reRequestData = status === "EXPIRED";

    const pending = status === "PENDING";

    const filename = `data_request_${id}.zip`;

    return (
      <div className="table-container notification">
        <Table>
          <thead>
            <tr>
              <th colSpan={2}>
                <p style={{ display: "inline-block" }}>
                  Requested {displayedTime(madeAt)}
                </p>
              </th>
              <th>
                <p
                  style={{
                    textAlign: "right"
                  }}
                >
                  {mayDownloadAll && (
                    <a
                      className="button download-all is-small is-success is-rounded"
                      href={`${
                        process.env.REACT_APP_BACKEND_URI
                          ? process.env.REACT_APP_BACKEND_URI.replace(
                              /\/+$/,
                              ""
                            )
                          : ""
                      }/downloads/data-requests/${id}/${filename}`}
                    >
                      Download all
                    </a>
                  )}
                  {(reRequestData || tryAgain) && (
                    <Mutation
                      mutation={CREATE_DATA_REQUEST}
                      refetchQueries={[
                        {
                          query: USER_DATA_REQUESTS_QUERY,
                          variables: {
                            limit: 5,
                            startIndex: 0
                          }
                        }
                      ]}
                    >
                      {(createDataRequest: any, { error }: any) => (
                        <>
                          <span>{reRequestData ? "Expired" : "Failed"}</span>
                          <Button
                            onClick={async () => {
                              this.recreateDataRequest(createDataRequest);
                            }}
                          >
                            {reRequestData ? "Re-request data" : "Try again"}
                          </Button>
                          {error ? (
                            <ErrorMessage>
                              {error.message
                                .replace("Network error: ", "")
                                .replace("GraphQL error: ", "")}
                            </ErrorMessage>
                          ) : null}
                        </>
                      )}
                    </Mutation>
                  )}
                  {pending && <span className="request-pending">Pending</span>}
                </p>
              </th>
            </tr>
            <tr>
              <td>
                <b>Requested calibration levels:</b>{" "}
                {calibrationLevels
                  .map(level => convertToTitleCase(level))
                  .join(", ")
                  .replace(/,([^,]*)$/, " and $1")}
              </td>
              <td colSpan={2}>
                <b>Requested calibration types:</b>{" "}
                {calibrationTypes.length
                  ? calibrationTypes
                      .map(type => convertToTitleCase(type))
                      .join(", ")
                      .replace(/,([^,]*)$/, " and $1")
                  : "None"}
              </td>
            </tr>
            <tr>
              <th colSpan={3}>Files</th>
            </tr>
            {dataFiles.map(file => {
              return (
                <tr key={file.id}>
                  <td colSpan={3}>{file.name}</td>
                </tr>
              );
            })}
          </thead>
          <tbody />
        </Table>
      </div>
    );
  }

  recreateDataRequest = async (create: any) => {
    const dataFileIds = this.props.dataRequest.dataFiles.map(file =>
      parseInt(file.id, 10)
    );
    // We may assume that no calibrations are included, as the list of data
    // files is by definition the complete set of files to request (i.e. it
    // includes calibrations if the initial request included them)
    await create({
      variables: {
        dataFiles: dataFileIds,
        includeCalibrations: false
      }
    });
  };
}

export default DataRequestTable;
