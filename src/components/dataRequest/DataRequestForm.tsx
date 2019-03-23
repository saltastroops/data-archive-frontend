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
 * The data request component
 *    Enables a logged in user to see the requested data status and permits the user to perform necessary actions.
 */
class DataRequestForm extends React.Component {
  render() {
    // TO BE UPDATED
    // Mocked data for display purpose only
    const { dataRequest } = mockedRequestedData as any;

    return (
      <>
        <Heading>Data Request</Heading>

        {dataRequest.map((data: any) => {
          const { dataFiles, madeAt, id } = data;

          const mayDownloadAll = !dataFiles.some((observation: any) =>
            ["FAILED", "PENDING"].includes(observation.status)
          );

          const reRequestAll = !dataFiles.some(
            (observation: any) => observation.status === "SUCCESSFUL"
          );

          return (
            <DataRequestTable
              key={id}
              dataFiles={dataFiles}
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
