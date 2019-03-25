import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import DataRequestForm from "../../../components/dataRequest/DataRequestForm";

describe("DataRequestForm Component", () => {
  it("renders the DataRequestForm component correctly", async () => {
    const wrapper = mount(<DataRequestForm />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
