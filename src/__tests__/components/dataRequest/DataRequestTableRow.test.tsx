import { mount } from "enzyme";
import * as React from "react";
import { DataRequestStatus } from "../../../components/dataRequest/DataRequestsForm";
import DataRequestTableRow from "../../../components/dataRequest/DataRequestTableRow";

describe("DataRequestTableRow Component", () => {
  it("renders the DataRequestTableRow component with the download button", async () => {
    const dataRequestPart = {
      dataFiles: [
        {
          id: "",
          name: "",
          observation: {
            id: "",
            name: ""
          }
        }
      ],
      id: "",
      status: "SUCCESSFUL" as DataRequestStatus,
      uri: ""
    };

    // DataRequestTableRow component wrapper.
    const wrapper = mount(
      <DataRequestTableRow dataRequestPart={dataRequestPart} />
    );

    // Expect the hyperlink button with the text Download to exist.
    expect(
      wrapper
        .find("a")
        .first()
        .text()
    ).toEqual("Download");
  });

  it("renders the DataRequestTableRow component with the re-request button", async () => {
    const dataRequestPart = {
      dataFiles: [
        {
          id: "",
          name: "",
          observation: {
            id: "",
            name: ""
          }
        }
      ],
      id: "",
      status: "FAILED" as DataRequestStatus,
      uri: ""
    };

    // DataRequestTableRow component wrapper.
    const wrapper = mount(
      <DataRequestTableRow dataRequestPart={dataRequestPart} />
    );

    // Expect the button with the text Re-request to exist.
    expect(
      wrapper
        .find("button")
        .first()
        .text()
    ).toEqual("Re-request");
  });

  it("renders the DataRequestTableRow component with no button", async () => {
    const dataRequestPart = {
      dataFiles: [
        {
          id: "",
          name: "",
          observation: {
            id: "",
            name: ""
          }
        }
      ],
      id: "",
      status: "PENDING" as DataRequestStatus,
      uri: ""
    };

    // DataRequestTableRow component wrapper.
    const wrapper = mount(
      <DataRequestTableRow dataRequestPart={dataRequestPart} />
    );

    // Expect the hyperlink button for Download not to exist.
    expect(wrapper.find("a").length).toEqual(0);

    // Expect the button for Re-request not to exist.
    expect(wrapper.find("button").length).toEqual(0);
  });
});
