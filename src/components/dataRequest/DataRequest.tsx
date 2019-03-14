import * as React from "react";
import styled from "styled-components";
import mockedRequestedData from "./requestedData.json";

const Heading = styled.h1.attrs({
  className: "title is-3"
})`
  && {
    text-align: center;
    margin: 20px 0 20px 0;
  }
`;

const RequestedObservation = styled.table.attrs({
  className: "table is-striped is-narrowed is-hoverable is-fullwidth"
})`
  && {
  }
`;

class DataRequest extends React.Component {
  render() {
    // TO BE UPDATED
    // Mocked data for display purpose only
    const { requestedData } = mockedRequestedData as any;

    return (
      <>
        <Heading>Data Request</Heading>
        {requestedData.map((data: any) => {
          const mayDownloadAll = data.observations.some(
            (observation: any) => observation.status !== "available"
          );

          const reRequestAll = data.observations.some((observation: any) =>
            ["available", "pending"].includes(observation.status)
          );
          return (
            <RequestedObservation key={data.date}>
              <thead>
                <tr>
                  <th>
                    <p style={{ display: "inline-block" }}>{data.date}</p>
                    <p
                      style={{
                        display: "inline-block",
                        position: "absolute",
                        right: 0
                      }}
                    >
                      {mayDownloadAll ? (
                        reRequestAll ? null : (
                          <button className="button is-small is-danger is-rounded">
                            Re-requestAll
                          </button>
                        )
                      ) : (
                        <button className="button is-small is-success is-rounded">
                          Download All
                        </button>
                      )}
                    </p>
                  </th>
                  <th />
                  <th />
                </tr>
                <tr>
                  <th>Observation</th>
                  <th>Status</th>
                  <th>Files</th>
                </tr>
              </thead>
              <tbody>
                {data.observations.map((observation: any) => {
                  const { id, status, files } = observation;
                  let download;
                  let reRequest;

                  switch (status) {
                    case "available":
                      download = (
                        <button className="button is-small is-success is-rounded">
                          Download
                        </button>
                      );
                      break;
                    case "failed":
                    case "unavailable":
                      reRequest = (
                        <button className="button is-small is-danger is-rounded">
                          Re-request
                        </button>
                      );
                      break;
                  }

                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>
                        <p>{status}</p>
                        <p>{download || reRequest}</p>
                      </td>
                      <td>
                        <ul>
                          {files.map((file: any) => {
                            return <li key={file}>{file}</li>;
                          })}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </RequestedObservation>
          );
        })}
      </>
    );
  }
}

export default DataRequest;
