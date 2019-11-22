import moment from "moment";
import * as React from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import { CREATE_DATA_REQUEST } from "../../graphql/Mutations";
import { USER_DATA_REQUESTS_QUERY } from "../../graphql/Query";
import DataKeys from "../searchFormComponents/results/DataKeys";
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
    const { dataFiles, madeAt, id, status } = this.props.dataRequest;

    const mayDownloadAll = status === "SUCCESSFUL";

    const tryAgain = status === "FAILED";

    const reRequestData = status === "EXPIRED";

    const pending = status === "PENDING";

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
                        <button
                          className="button re-request-all is-small is-danger is-rounded"
                          onClick={async () => {
                            this.recreateDataRequest(createDataRequest);
                          }}
                        >
                          {reRequestData ? "Re-request data" : "Try again"}
                        </button>{" "}
                        <span className="request-status">
                          {reRequestData ? "Expired" : "Failed"}
                        </span>
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
                {pending && <span className="request-status">Pending</span>}
              </p>
            </th>
          </tr>
          <tr>
            <th>Files</th>
          </tr>
          {dataFiles.map(file => {
            const nameMetadata = file.metadata.find(
              v => v.name === DataKeys.DATA_FILE_FILENAME
            );
            const name = nameMetadata ? nameMetadata.value : null;
            return (
              <tr key={file.id}>
                <td>{name}</td>
              </tr>
            );
          })}
        </thead>
        <tbody />
      </Table>
    );
  }

  recreateDataRequest = async (create: any) => {
    const dataFileIds = this.props.dataRequest.dataFiles.map(file =>
      parseInt(file.id, 10)
    );
    await create({ variables: { dataFiles: dataFileIds } });
  };
}

export default DataRequestTable;
