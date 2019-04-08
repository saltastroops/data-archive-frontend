import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import {
  DataRequestStatus,
  IDataRequest
} from "../../../components/dataRequest/DataRequestsForm";
import DataRequestTableRow from "../../../components/dataRequest/DataRequestTableRow";

const dummyDataRequestPartWrapper = (status: DataRequestStatus) => {
  const dataRequestPart = {
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
    status,
    uri: "http://demo/data-request/part-1"
  };
  return mount(
    <table>
      <tbody>
        <DataRequestTableRow dataRequestPart={dataRequestPart} />
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

  it("includes and excludes download and re-request links as required", async () => {
    let wrapper = dummyDataRequestPartWrapper("SUCCESSFUL");
    expect(wrapper.find(".download").length).toBe(1);
    expect(wrapper.find(".re-request").length).toBe(0);

    wrapper = dummyDataRequestPartWrapper("PENDING");
    expect(wrapper.find(".download").length).toBe(0);
    expect(wrapper.find(".re-request").length).toBe(0);

    wrapper = dummyDataRequestPartWrapper("FAILED");
    expect(wrapper.find(".download").length).toBe(0);
    expect(wrapper.find(".re-request").length).toBe(1);

    wrapper = dummyDataRequestPartWrapper("EXPIRED");
    expect(wrapper.find(".download").length).toBe(0);
    expect(wrapper.find(".re-request").length).toBe(1);
  });
});
