import moment from "moment";
import * as React from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import { USER_DATA_REQUESTS_QUERY } from "../../graphql/Query";
import DataRequestTable from "./DataRequestTable";

const Heading = styled.h1.attrs({
  className: "title is-3",
})`
  && {
    text-align: center;
    margin: 20px 0 20px 0;
  }
`;

const ErrorMessage = styled.p.attrs({
  className: "error tile",
})`
  && {
    text-align: left;
    margin: 3px 0 3px 0;
    padding: 2px 0 2px 0;
    background-color: hsl(348, 100%, 61%);
    color: white;
  }
`;

export interface IDataFile {
  id: string;
  name: string;
}

export interface IDataRequest {
  id: string;
  madeAt: string;
  dataFiles: IDataRequestFile[];
  status: DataRequestStatus;
  uri: string;
  calibrationLevels: string[];
  calibrationTypes: string[];
}

export interface IDataRequestFile {
  id: string;
  name: string;
}

export type DataRequestStatus = "EXPIRED" | "FAILED" | "PENDING" | "SUCCESSFUL";

/**
 * A component for displaying the user's data requests.
 *
 * Enables a logged in user to review the status and content of their data
 * requests, and allows them to download and re-request data.
 */
class DataRequestsForm extends React.Component {
  render() {
    return (
      <Query
        query={USER_DATA_REQUESTS_QUERY}
        variables={{
          limit: 5,
          startIndex: 0,
        }}
        pollInterval={30000}
      >
        {({ data, loading, error }: any) => {
          if (loading) {
            return <p>Loading...</p>;
          }

          if (error) {
            return (
              <ErrorMessage>
                {error.message
                  .replace("Network error: ", "")
                  .replace("GraphQL error: ", "")}
              </ErrorMessage>
            );
          }

          const { dataRequests } = data;

          const sortedDataRequests = [...dataRequests];
          sortedDataRequests.sort(
            (a, b) => moment(b.madeAt).valueOf() - moment(a.madeAt).valueOf()
          );

          return (
            <>
              <Heading>Data Requests</Heading>

              {sortedDataRequests.map((dataRequest: IDataRequest) => {
                return (
                  <DataRequestTable
                    key={dataRequest.id}
                    dataRequest={dataRequest}
                  />
                );
              })}
            </>
          );
        }}
      </Query>
    );
  }
}

export default DataRequestsForm;
