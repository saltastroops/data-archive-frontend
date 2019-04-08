import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import DataRequestsForm from "../../../components/dataRequest/DataRequestsForm";

describe("DataRequestsForm", () => {
  it("renders the DataRequestForm component correctly", async () => {
    const wrapper = mount(<DataRequestsForm />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
