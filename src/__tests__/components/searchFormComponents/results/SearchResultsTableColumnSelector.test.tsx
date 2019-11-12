import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import SearchResultsTableColumn from "../../../../components/searchFormComponents/results/ISearchResultsTableColumn";
import { availableResultsTableColumns } from "../../../../components/searchFormComponents/results/SearchResultsTableColumns";
import SearchResultsTableColumnSelector from "../../../../components/searchFormComponents/results/SearchResultsTableColumnSelector";

const columns: SearchResultsTableColumn[] = availableResultsTableColumns();

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

    expect(
      wrapper.find('input[name="proposal.proposal_code"]').prop("checked")
    ).toBeFalsy();
    expect(
      wrapper.find('input[name="proposal.pi"]').prop("checked")
    ).toBeFalsy();
    expect(
      wrapper.find('input[name="target.name"]').prop("checked")
    ).toBeTruthy();
  });

  it("should call onChange with the correct arguments when a checkbox is clicked", () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <SearchResultsTableColumnSelector columns={columns} onChange={onChange} />
    );

    const proposalInput = wrapper.find('input[name="proposal.proposal_code"]');
    proposalInput.simulate("change", {
      target: { name: "proposal.proposal_code", checked: false }
    });

    const piInput = wrapper.find('input[name="proposal.pi"]');
    piInput.simulate("change", {
      target: { name: "proposal.pi", checked: true }
    });

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(
      1,
      "proposal.proposal_code",
      false
    );
    expect(onChange).toHaveBeenNthCalledWith(2, "proposal.pi", true);
  });
});
