import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SearchResultsTableColumn from "../../../../components/searchFormComponents/results/ISearchResultsTableColumn";
import SearchResultsTableColumnSelector from "../../../../components/searchFormComponents/results/SearchResultsTableColumnSelector";

const columns: SearchResultsTableColumn[] = [
  { dataKey: "dummy", name: "Dummy", visible: true },
  { dataKey: "proposal", name: "Proposal", visible: true },
  { dataKey: "pi", name: "Principal Investigator", visible: false },
  { dataKey: "target", name: "Target Name", visible: true }
];

describe("SearchResultsTableColumn", () => {
  it("should render correctly", () => {
    const wrapper = mount(
      <SearchResultsTableColumnSelector
        columns={columns}
        onChange={jest.fn()}
      />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should check the correct checkboxes", () => {
    const wrapper = mount(
      <SearchResultsTableColumnSelector
        columns={columns}
        onChange={jest.fn()}
      />
    );

    expect(wrapper.find('input[name="proposal"]').prop("checked")).toBeTruthy();
    expect(wrapper.find('input[name="pi"]').prop("checked")).toBeFalsy();
    expect(wrapper.find('input[name="target"]').prop("checked")).toBeTruthy();
  });

  it("should call onChange with the correct arguments when a checkbox is clicked", () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <SearchResultsTableColumnSelector columns={columns} onChange={onChange} />
    );

    const proposalInput = wrapper.find('input[name="proposal"]');
    proposalInput.simulate("change", {
      target: { name: "proposal", checked: false }
    });

    const piInput = wrapper.find('input[name="pi"]');
    piInput.simulate("change", { target: { name: "pi", checked: true } });

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, "proposal", false);
    expect(onChange).toHaveBeenNthCalledWith(2, "pi", true);
  });
});
