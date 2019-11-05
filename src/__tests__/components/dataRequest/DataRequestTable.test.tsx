import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import {
  DataRequestStatus,
  IDataFile,
  IDataRequest
} from "../../../components/dataRequest/DataRequestsForm";
import DataRequestTable from "../../../components/dataRequest/DataRequestTable";

const dummyDataRequestsWrapper = (status: DataRequestStatus) => {
  const df: IDataFile = {
    id: `file-${1}a`,
    name: `filename ${1}a`
  };
  const dataFiles = ["1", "2", "3"].map((id, index) => ({
    id: `file-${index}`,
    name: `filename ${index}`
  })) as IDataFile[];

  const dataReqest = {
    dataFiles,
    id: "request-1",
    madeAt: "2018-12-01 20:00",
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
