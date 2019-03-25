import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import DataRequestForm from "../../../components/dataRequest/DataRequestForm";

describe("DataRequestForm Component", () => {
  it("renders the DataRequestForm component no errors", async () => {
    // DataRequestForm component wrapper.
    const wrapper = mount(<DataRequestForm />);
    // Expect the snapshot to match the DataRequestForm component.
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should contain DataRequestTable", () => {
    // DataRequestForm component wrapper.
    const wrapper = mount(<DataRequestForm />);

    const dataRequestTable = wrapper.find("DataRequestTable");

    expect(dataRequestTable).toBeDefined();
  });

  it("should contain DataRequestTableRow", () => {
    // DataRequestForm component wrapper.
    const wrapper = mount(<DataRequestForm />);

    const dataRequestTableRow = wrapper.find("DataRequestTableRow");

    expect(dataRequestTableRow).toBeDefined();
  });
});
