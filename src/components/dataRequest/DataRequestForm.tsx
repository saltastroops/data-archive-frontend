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
    const { dataRequests } = mockedRequestedData as any;

    const sortedDataRequests = [...dataRequests];
    sortedDataRequests.sort(
      (a, b) => moment(b.madeAt).unix() - moment(a.madeAt).unix()
    );

    return (
      <>
        <Heading>Data Request</Heading>

        {sortedDataRequests.map((dataRequest: any) => {
          return (
            <DataRequestTable key={dataRequest.id} dataRequest={dataRequest} />
          );
        })}
      </>
    );
  }
}

export default DataRequestForm;
