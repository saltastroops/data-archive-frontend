import * as React from "react";
import styled from "styled-components";
import DataRequestTable from "./DataRequestTable";
import mockedRequestedData from "./requestedData.json";
import moment from "moment";

const Heading = styled.h1.attrs({
  className: "title is-3"
})`
  && {
    text-align: center;
    margin: 20px 0 20px 0;
  }
`;

export interface DataFile {
  id: string;
  name: string;
  observation: Observation;
}

export interface DataRequestPart {
  dataFiles: DataFile[];
  id: string;
  status: DataRequestStatus;
}

export interface DataRequest {
  id: string;
  madeAt: string;
  parts: DataRequestPart[];
}

export type DataRequestStatus = "EXPIRED" | "FAILED" | "PENDING" | "SUCCESSFUL";

interface Observation {
  id: string;
  name: string;
}

/**
 * The data request component.
 *
 * Enables a logged in user to review the status and content of their data
 * requests, and allows them to download and re-request data.
 */
class DataRequestForm extends React.Component {
  render() {
    // TO BE UPDATED
    // Mocked data for display purpose only
    const { dataRequests } = mockedRequestedData as {
      dataRequests: DataRequest[];
    };

    const sortedDataRequests = [...dataRequests];
    sortedDataRequests.sort(
      (a, b) => moment(b.madeAt).valueOf() - moment(a.madeAt).valueOf()
    );

    return (
      <>
        <Heading>Data Request</Heading>

        {sortedDataRequests.map((dataRequest: DataRequest) => {
          return (
            <DataRequestTable key={dataRequest.id} dataRequest={dataRequest} />
          );
        })}
      </>
    );
  }
}

export default DataRequestForm;
