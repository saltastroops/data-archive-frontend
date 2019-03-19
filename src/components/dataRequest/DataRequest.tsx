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
    const { dataRequest } = mockedRequestedData as any;

    return (
      <>
        <Heading>Data Request</Heading>
        {dataRequest.map((data: any) => {
          const { dataFiles } = data;

          let groupedObservations: any = [];

          const observations = dataFiles.map(
            (file: any, index: any, observations: any) => {
              if (
                !groupedObservations.some(
                  (observation: any) => observation.id === file.observation.id
                )
              ) {
                groupedObservations.push({
                  id: file.observation.id,
                  status: file.available,
                  files: [file]
                });
              } else {
                groupedObservations.map((observation: any) => {
                  if (observation.id === file.observation.id) {
                    observation.status = file.available;
                    observation.files.push(file);
                  }
                });
              }
            }
          );

          const mayDownloadAll = !groupedObservations
            .map((observation: any) => observation.status)
            .includes(false);

          const reRequestAll = !groupedObservations
            .map((observation: any) => observation.status)
            .includes(true);

          return (
            <RequestedObservation key={data.id}>
              <thead>
                <tr>
                  <th colSpan={3}>
                    <p style={{ display: "inline-block" }}>
                      Requested {data.madeAt}
                    </p>
                    <p
                      style={{
                        display: "inline-block",
                        position: "absolute",
                        right: 0
                      }}
                    >
                      {mayDownloadAll ? (
                        <button className="button is-small is-success is-rounded">
                          Download all
                        </button>
                      ) : reRequestAll ? (
                        <button className="button is-small is-danger is-rounded">
                          Re-request all
                        </button>
                      ) : null}
                    </p>
                  </th>
                </tr>
                <tr>
                  <th>Observation</th>
                  <th>Status</th>
                  <th>Files</th>
                </tr>
              </thead>
              <tbody>
                {groupedObservations.map((observation: any) => {
                  const { files, status } = observation;

                  let download;
                  let reRequest;

                  if (status) {
                    download = (
                      <button className="button is-small is-success is-rounded">
                        Download
                      </button>
                    );
                  } else {
                    reRequest = (
                      <button className="button is-small is-danger is-rounded">
                        Re-request
                      </button>
                    );
                  }

                  return (
                    <tr key={observation.id}>
                      <td>{observation.id}</td>
                      <td>
                        <p>{status ? "Available" : "Unavailable"}</p>
                        <p>{download || reRequest}</p>
                      </td>
                      <td>
                        <ul>
                          {files.map((file: any) => {
                            return <li key={file.id}>{file.name}</li>;
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
