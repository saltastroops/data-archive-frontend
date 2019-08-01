import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import {
  DataRequestStatus,
  IDataRequest
} from "../../../components/dataRequest/DataRequestsForm";
import DataRequestTable from "../../../components/dataRequest/DataRequestTable";

const dummyDataRequestsWrapper = (...statusValues: DataRequestStatus[]) => {
  const observations = statusValues.map((status, index) => ({
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
    id: `obz-${index}`,
    name: `part-${index}`
  }));

  const dataReqest = {
    id: "request-1",
    madeAt: "2018-12-01 20:00",
    observations,
    uri: `http://demo/data-request/request-1`
  } as IDataRequest;

  return mount(<DataRequestTable dataRequest={dataReqest} />);
};

describe("DataRequestTable", () => {
  it("should render correctly", () => {
    expect(
      toJson(dummyDataRequestsWrapper("SUCCESSFUL", "FAILED", "EXPIRED"))
    ).toMatchSnapshot();
  });

  it("includes a link for downloading all files if all request parts are marked successful", async () => {
    // all parts are marked successful

    let wrapper = dummyDataRequestsWrapper("SUCCESSFUL");
    expect(wrapper.find(".download-all").length).toBe(1);

    wrapper = dummyDataRequestsWrapper("SUCCESSFUL", "SUCCESSFUL");
    expect(wrapper.find(".download-all").length).toBe(1);

    wrapper = dummyDataRequestsWrapper(
      "SUCCESSFUL",
      "SUCCESSFUL",
      "SUCCESSFUL"
    );
    expect(wrapper.find(".download-all").length).toBe(1);
  });

  it("does not include a link for downloading all files if at least one request part is not marked successful", async () => {
    let wrapper = dummyDataRequestsWrapper("PENDING");
    expect(wrapper.find(".download-all").length).toBe(0);

    wrapper = dummyDataRequestsWrapper("FAILED");
    expect(wrapper.find(".download-all").length).toBe(0);

    wrapper = dummyDataRequestsWrapper("EXPIRED");
    expect(wrapper.find(".download-all").length).toBe(0);

    wrapper = dummyDataRequestsWrapper("EXPIRED", "PENDING");
    expect(wrapper.find(".download-all").length).toBe(0);

    wrapper = dummyDataRequestsWrapper("SUCCESSFUL", "PENDING", "SUCCESSFUL");
    expect(wrapper.find(".download-all").length).toBe(0);
  });

  it("includes a link for re-requesting all files if not all parts are marked successful and none is pending", () => {
    let wrapper = dummyDataRequestsWrapper("EXPIRED");
    expect(wrapper.find(".re-request-all").length).toBe(1);

    wrapper = dummyDataRequestsWrapper("FAILED");
    expect(wrapper.find(".re-request-all").length).toBe(1);

    wrapper = dummyDataRequestsWrapper("SUCCESSFUL", "FAILED");
    expect(wrapper.find(".re-request-all").length).toBe(1);

    wrapper = dummyDataRequestsWrapper("EXPIRED", "SUCCESSFUL", "EXPIRED");
    expect(wrapper.find(".re-request-all").length).toBe(1);
  });

  it("does not include a link for re-requesting all files if all parts are marked successful or there is a pending one", () => {
    let wrapper = dummyDataRequestsWrapper("SUCCESSFUL");
    expect(wrapper.find(".re-request-all").length).toBe(0);

    wrapper = dummyDataRequestsWrapper("SUCCESSFUL", "SUCCESSFUL");
    expect(wrapper.find(".re-request-all").length).toBe(0);

    wrapper = dummyDataRequestsWrapper(
      "SUCCESSFUL",
      "SUCCESSFUL",
      "SUCCESSFUL"
    );
    expect(wrapper.find(".re-request-all").length).toBe(0);

    wrapper = dummyDataRequestsWrapper("PENDING");
    expect(wrapper.find(".re-request-all").length).toBe(0);

    wrapper = dummyDataRequestsWrapper("FAILED", "EXPIRED", "PENDING");
    expect(wrapper.find(".re-request-all").length).toBe(0);
  });
});
