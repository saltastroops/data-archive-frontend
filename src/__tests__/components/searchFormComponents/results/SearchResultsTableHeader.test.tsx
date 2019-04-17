import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { SortDirection } from "react-virtualized";
import wait from "waait";
import SearchResultsTableHeader from "../../../../components/searchFormComponents/results/SearchResultsTableHeader";

describe("SearchResultsTableHeader", () => {
  it("should render correctly", () => {
    const wrapper = mount(
      <SearchResultsTableHeader
        dataKey="ProposalTitle"
        sort={jest.fn()}
        style={{}}
      >
        <span>Proposal Title</span>
      </SearchResultsTableHeader>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should render a sort direction indicator if the data key and sort by key are equal", () => {
    const wrapper = mount(
      <SearchResultsTableHeader
        dataKey="ProposalTitle"
        sort={jest.fn()}
        sortBy="ProposalTitle"
        style={{}}
      >
        <span>Proposal Title</span>
      </SearchResultsTableHeader>
    );
    expect(wrapper.find("svg").length).toBe(1);
  });

  it("should not render a sort direction indicator if the data key and sort by key are not equal", () => {
    const wrapper = mount(
      <SearchResultsTableHeader
        dataKey="ProposalTitle"
        sort={jest.fn()}
        style={{}}
      >
        <span>Proposal Title</span>
      </SearchResultsTableHeader>
    );
    expect(wrapper.find("svg").length).toBe(0);
  });

  it("should handle clicks on the header if the data key and sort by key are equal", async () => {
    // Initially there is an up indicator.
    const sort = jest.fn();
    const wrapper = mount(
      <SearchResultsTableHeader
        dataKey="ProposalTitle"
        sort={sort}
        sortBy="ProposalTitle"
        style={{}}
      >
        <span>Proposal Title</span>
      </SearchResultsTableHeader>
    );
    expect(wrapper.find("svg.fa-sort-up").length).toBe(1);

    // Click the header
    const header = wrapper.find('[data-test="header"]');
    header.simulate("click");
    await wait(0);
    wrapper.update();

    // There is a down indicator now
    expect(wrapper.find("svg.fa-sort-down").length).toBe(1);

    // Click the header again
    header.simulate("click");
    await wait(0);
    wrapper.update();

    // The sort function has been called twice
    expect(sort).toHaveBeenCalledTimes(2);
    expect(sort).toHaveBeenNthCalledWith(1, {
      sortBy: "ProposalTitle",
      sortDirection: SortDirection.DESC
    });
    expect(sort).toHaveBeenNthCalledWith(2, {
      sortBy: "ProposalTitle",
      sortDirection: SortDirection.ASC
    });
  });

  it("should handle clicks on the header if the data key and sort by key are not equal", async () => {
    const sort = jest.fn();
    const wrapper = mount(
      <SearchResultsTableHeader
        dataKey="ProposalTitle"
        sort={sort}
        sortBy="TargetName"
        style={{}}
      >
        <span>Proposal Title</span>
      </SearchResultsTableHeader>
    );

    // Click the header
    const header = wrapper.find('[data-test="header"]');
    header.simulate("click");
    await wait(0);
    wrapper.update();

    // The sort function has been called
    expect(sort).toHaveBeenCalledWith({
      sortBy: "ProposalTitle",
      sortDirection: SortDirection.ASC
    });
  });
});
