import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { DataRequestStatus } from "../../../components/dataRequest/DataRequestsForm";
import DataRequestTableRow from "../../../components/dataRequest/DataRequestTableRow";

const dummyDataRequestPartWrapper = (status: DataRequestStatus) => {
  const dataRequestObservation = {
    dataFiles: [
      {
        id: "file-1",
        name: "File 1",
        observation: {
          id: "obs-1",
          name: "Observation 1"
        }
      },
      {
        id: "file-2",
        name: "File 2",
        observation: {
          id: "obs-2",
          name: "Observation 2"
        }
      }
    ],
    id: "part-1",
    name: "obz-1",
    status
  };
  return mount(
    <table>
      <tbody>
        <DataRequestTableRow dataRequestObservation={dataRequestObservation} />
      </tbody>
    </table>
  );
};

describe("DataRequestTableRow", () => {
  it("renders correctly", () => {
    let wrapper = dummyDataRequestPartWrapper("SUCCESSFUL");
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper = dummyDataRequestPartWrapper("PENDING");
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper = dummyDataRequestPartWrapper("FAILED");
    expect(toJson(wrapper)).toMatchSnapshot();

    wrapper = dummyDataRequestPartWrapper("EXPIRED");
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
