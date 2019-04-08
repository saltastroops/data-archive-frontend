import moment from "moment";
import * as React from "react";
import styled from "styled-components";
import DataRequestTable from "./DataRequestTable";
import mockedRequestedData from "./requestedData.json";

const Heading = styled.h1.attrs({
  className: "title is-3"
})`
  && {
    text-align: center;
    margin: 20px 0 20px 0;
  }
`;

export interface IDataFile {
  id: string;
  name: string;
  observation: IObservation;
}

export interface IDataRequestPart {
  dataFiles: IDataFile[];
  id: string;
  status: DataRequestStatus;
  uri: string;
}

export interface IDataRequest {
  id: string;
  madeAt: string;
  parts: IDataRequestPart[];
  uri: string;
}

export type DataRequestStatus = "EXPIRED" | "FAILED" | "PENDING" | "SUCCESSFUL";

interface IObservation {
  id: string;
  name: string;
}

/**
 * A component for displaying the user's data requests.
 *
 * Enables a logged in user to review the status and content of their data
 * requests, and allows them to download and re-request data.
 */
class DataRequestsForm extends React.Component {
  render() {
    // TO BE UPDATED
    // Mocked data for display purpose only
    const { dataRequests } = mockedRequestedData as {
      dataRequests: IDataRequest[];
    };

    const sortedDataRequests = [...dataRequests];
    sortedDataRequests.sort(
      (a, b) => moment(b.madeAt).valueOf() - moment(a.madeAt).valueOf()
    );

    return (
      <>
        <Heading>Data Request</Heading>

        {sortedDataRequests.map((dataRequest: IDataRequest) => {
          return (
            <DataRequestTable key={dataRequest.id} dataRequest={dataRequest} />
          );
        })}
      </>
    );
  }
}

export default DataRequestsForm;
