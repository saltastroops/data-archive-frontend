import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "@apollo/react-testing";
import DataRequestsForm from "../../../components/dataRequest/DataRequestsForm";

describe("DataRequestsForm", () => {
  it("renders the DataRequestForm component correctly", async () => {
    const wrapper = mount(
      <MockedProvider>
        <DataRequestsForm />
      </MockedProvider>
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
