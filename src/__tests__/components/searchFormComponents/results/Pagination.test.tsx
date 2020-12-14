import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "@apollo/react-testing";
import Pagination from "../../../../components/searchFormComponents/results/Pagination";

const fetchPage = jest.fn();

describe("Pagination", () => {
  afterEach(() => {
    fetchPage.mockReset();
  });

  it("should render correctly with correct props", () => {
    const wrapper = mount(
      <Pagination
        fetchPage={fetchPage}
        itemsOnCurrentPage={100}
        itemsPerPage={100}
        itemsTotal={201}
        startIndex={0}
      />
    );
    expect(toJson(wrapper)).toMatchSnapshot();

    const wrapper2 = mount(
      <Pagination
        fetchPage={fetchPage}
        itemsOnCurrentPage={10}
        itemsPerPage={10}
        itemsTotal={201}
        startIndex={10}
      />
    );
    expect(toJson(wrapper2)).toMatchSnapshot();

    const wrapper3 = mount(
      <Pagination
        fetchPage={fetchPage}
        itemsOnCurrentPage={201}
        itemsPerPage={1000}
        itemsTotal={201}
        startIndex={0}
      />
    );
    expect(toJson(wrapper3)).toMatchSnapshot();
  });

  it("should enable the previous button when there is previous data", () => {
    const wrapper = mount(
      <Pagination
        fetchPage={fetchPage}
        itemsOnCurrentPage={10}
        itemsPerPage={10}
        itemsTotal={201}
        startIndex={11}
      />
    );
    expect(
      wrapper
        .find('button[data-test="pagination-previous"]')
        .first()
        .prop("disabled")
    ).toBeFalsy();
  });

  it("should disable the previous button when there is no previous data", () => {
    const wrapper = mount(
      <Pagination
        fetchPage={fetchPage}
        itemsOnCurrentPage={100}
        itemsPerPage={100}
        itemsTotal={201}
        startIndex={0}
      />
    );
    expect(
      wrapper
        .find('button[data-test="pagination-previous"]')
        .first()
        .prop("disabled")
    ).toBeTruthy();
  });

  it("should enable next button when there is next data", () => {
    const wrapper = mount(
      <Pagination
        fetchPage={fetchPage}
        itemsOnCurrentPage={100}
        itemsPerPage={100}
        itemsTotal={201}
        startIndex={0}
      />
    );
    expect(
      wrapper
        .find('button[data-test="pagination-next"]')
        .first()
        .prop("disabled")
    ).toBeFalsy();
  });

  it("should disable the next button when there is no next data", () => {
    const wrapper = mount(
      <Pagination
        fetchPage={fetchPage}
        itemsOnCurrentPage={100}
        itemsPerPage={100}
        itemsTotal={100}
        startIndex={0}
      />
    );
    expect(
      wrapper
        .find('button[data-test="pagination-next"]')
        .first()
        .prop("disabled")
    ).toBeTruthy();
  });

  it("should disable both the next and the previous button when there is no next and previous data to fetch", () => {
    const wrapper = mount(
      <Pagination
        fetchPage={fetchPage}
        itemsOnCurrentPage={100}
        itemsPerPage={100}
        itemsTotal={100}
        startIndex={0}
      />
    );
    expect(
      wrapper
        .find('button[data-test="pagination-previous"]')
        .first()
        .prop("disabled")
    ).toBeTruthy();
    expect(
      wrapper
        .find('button[data-test="pagination-next"]')
        .first()
        .prop("disabled")
    ).toBeTruthy();
  });

  it("should not disable next and fetchPage button when there is next and previous data", () => {
    const wrapper = mount(
      <Pagination
        fetchPage={fetchPage}
        itemsOnCurrentPage={100}
        itemsPerPage={10}
        itemsTotal={100}
        startIndex={11}
      />
    );
    expect(
      wrapper
        .find('button[data-test="pagination-previous"]')
        .first()
        .prop("disabled")
    ).toBeFalsy();
    expect(
      wrapper
        .find('button[data-test="pagination-next"]')
        .first()
        .prop("disabled")
    ).toBeFalsy();
  });

  it("should fetchPage with the correct parameters when the previous button is clicked", () => {
    const wrapper = mount(
      <Pagination
        fetchPage={fetchPage}
        itemsOnCurrentPage={100}
        itemsPerPage={10}
        itemsTotal={100}
        startIndex={10}
      />
    );

    const previousButton = wrapper
      .find('button[data-test="pagination-previous"]')
      .first();
    previousButton.simulate("click");
    expect(fetchPage).toHaveBeenCalledWith(0, 10, "PREVIOUS");
  });

  it("should fetchPage with the correct parameters when the next button is clicked", () => {
    const wrapper = mount(
      <Pagination
        fetchPage={fetchPage}
        itemsOnCurrentPage={10}
        itemsPerPage={10}
        itemsTotal={100}
        startIndex={10}
      />
    );

    const previousButton = wrapper
      .find('button[data-test="pagination-next"]')
      .first();
    previousButton.simulate("click");
    expect(fetchPage).toHaveBeenCalledWith(20, 10, "NEXT");
  });
});
