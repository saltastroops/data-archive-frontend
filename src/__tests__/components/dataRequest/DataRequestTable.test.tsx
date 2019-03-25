import { mount } from "enzyme";
import * as React from "react";
import { DataRequestStatus } from "../../../components/dataRequest/DataRequestsForm";
import DataRequestTable from "../../../components/dataRequest/DataRequestTable";

describe("DataRequestTable Component", () => {
  it("renders the DataRequestTable component with the download all button", async () => {
    // Requested data available for download
    const dataRequest = {
      id: "rd1",
      madeAt: "2018-12-01 20:00",
      parts: [
        {
          dataFiles: [
            {
              id: "file 1",
              name: "filename 1",
              observation: {
                id: "obs 1",
                name: "Observation 1"
              }
            }
          ],
          id: "obsR1",
          status: "SUCCESSFUL" as DataRequestStatus,
          uri: "http://demo/data-request/part/obsR1"
        }
      ],
      uri: "http://demo/data-request/part/rd1"
    };
    // DataRequestTable component wrapper.
    const wrapper = mount(<DataRequestTable dataRequest={dataRequest} />);

    // Expect the hyperlink with the text Download all to exist.
    expect(
      wrapper
        .find("a")
        .first()
        .text()
    ).toEqual("Download all");
  });

  it("renders the DataRequestTable component with the re-request all button", async () => {
    // Requested data available for download
    const dataRequest = {
      id: "rd1",
      madeAt: "2018-12-01 20:00",
      parts: [
        {
          dataFiles: [
            {
              id: "file 1",
              name: "filename 1",
              observation: {
                id: "obs 1",
                name: "Observation 1"
              }
            }
          ],
          id: "obsR1",
          status: "FAILED" as DataRequestStatus,
          uri: "http://demo/data-request/part/obsR1"
        }
      ],
      uri: "http://demo/data-request/part/rd1"
    };
    // DataRequestTable component wrapper.
    const wrapper = mount(<DataRequestTable dataRequest={dataRequest} />);

    // Expect the button with the text Re-request all to exist.
    expect(
      wrapper
        .find("button")
        .first()
        .text()
    ).toEqual("Re-request all");
  });

  it("renders the DataRequestTable component with no download or re-request all button", async () => {
    // Requested data available for download
    const dataRequest = {
      id: "rd1",
      madeAt: "2018-12-01 20:00",
      parts: [
        {
          dataFiles: [
            {
              id: "file 1",
              name: "filename 1",
              observation: {
                id: "obs 1",
                name: "Observation 1"
              }
            }
          ],
          id: "obsR1",
          status: "SUCCESSFUL" as DataRequestStatus,
          uri: "http://demo/data-request/part/obsR1"
        },
        {
          dataFiles: [
            {
              id: "file 1",
              name: "filename 1",
              observation: {
                id: "obs 1",
                name: "Observation 1"
              }
            }
          ],
          id: "obsR2",
          status: "FAILED" as DataRequestStatus,
          uri: "http://demo/data-request/part/obsR1"
        }
      ],
      uri: "http://demo/data-request/part/rd1"
    };
    // DataRequestTable component wrapper.
    let wrapper = mount(<DataRequestTable dataRequest={dataRequest} />);

    // Expect the hyperlink with the text Download all not to exist.
    expect(
      wrapper
        .find("a")
        .first()
        .text()
    ).not.toEqual("Re-request all");

    // Expect the button with the text Re-request all not to exist.
    expect(
      wrapper
        .find("button")
        .first()
        .text()
    ).not.toEqual("Re-request all");

    /**
     * Modified to accommodate the case of Pending and Successful status
     */
    dataRequest.parts[1].status = "PENDING";

    // DataRequestTable component wrapper.
    wrapper = mount(<DataRequestTable dataRequest={dataRequest} />);

    // Expect the hyperlink with the text Download all not to exist.
    expect(
      wrapper
        .find("a")
        .first()
        .text()
    ).not.toEqual("Re-request all");

    // Expect the button with the text Re-request all not to exist.
    expect(wrapper.find("button").length).toEqual(0);
  });
});
