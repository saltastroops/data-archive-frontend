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

    return (
      <>
        <Heading>Data Request</Heading>

        {dataRequests.map((dataRequest: any) => {
          const { parts, madeAt, id } = dataRequest;

          const mayDownloadAll = !parts.some((observation: any) =>
            ["FAILED", "PENDING"].includes(observation.status)
          );

          const reRequestAll = !parts.some(
            (observation: any) => observation.status === "SUCCESSFUL"
          );

          return (
            <DataRequestTable
              key={id}
              dataFiles={parts}
              madeAt={madeAt}
              mayDownloadAll={mayDownloadAll}
              reRequestAll={reRequestAll}
            />
          );
        })}
      </>
    );
  }
}

export default DataRequestForm;
