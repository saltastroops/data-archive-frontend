import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import {
  DataRequestStatus,
  IDataRequest
} from "../../../components/dataRequest/DataRequestsForm";
import DataRequestTable from "../../../components/dataRequest/DataRequestTable";

const dummyDataRequestsWrapper = (status: DataRequestStatus) => {
  const observations = ["1", "2", "3"].map((id, index) => ({
    dataFiles: [
      {
        id: `file-${index}a`,
        name: `filename ${index}a`,
        observation: {
          id: `obs-${index}a`,
          name: `Observation ${index}a`
        }
      },
      {
        id: `file-${index}b`,
        name: `filename ${index}b`,
        observation: {
          id: `obs-${index}b`,
          name: `Observation ${index}b`
        }
      }
    ],
    id,
    name: `part-${index}`
  }));

  const dataReqest = {
    id: "request-1",
    madeAt: "2018-12-01 20:00",
    observations,
    status,
    uri: `http://demo/data-request/request-1`
  } as IDataRequest;

  return mount(<DataRequestTable dataRequest={dataReqest} />);
};

describe("DataRequestTable", () => {
  it("should render correctly", () => {
    expect(toJson(dummyDataRequestsWrapper("SUCCESSFUL"))).toMatchSnapshot();
  });

  it("includes a link for downloading all files if data request status is successful", async () => {
    const wrapper = dummyDataRequestsWrapper("SUCCESSFUL");
    expect(wrapper.find(".download-all").length).toBe(1);
  });

  it("does not include a link for downloading all if data request status is not successful", async () => {
    let wrapper = dummyDataRequestsWrapper("PENDING");
    expect(wrapper.find(".download-all").length).toBe(0);

    wrapper = dummyDataRequestsWrapper("FAILED");
    expect(wrapper.find(".download-all").length).toBe(0);
  });

  it("includes a link for re-requesting if data request status is not successful and none is pending", () => {
    const wrapper = dummyDataRequestsWrapper("FAILED");
    expect(wrapper.find(".re-request-all").length).toBe(1);
  });

  it("does not include a link for re-requesting all if data request status is successful or pending", () => {
    let wrapper = dummyDataRequestsWrapper("SUCCESSFUL");
    expect(wrapper.find(".re-request-all").length).toBe(0);

    wrapper = dummyDataRequestsWrapper("PENDING");
    expect(wrapper.find(".re-request-all").length).toBe(0);
  });
});
