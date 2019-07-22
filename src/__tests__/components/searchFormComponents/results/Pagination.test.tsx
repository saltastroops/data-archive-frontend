import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { MockedProvider } from "react-apollo/test-utils";
import Pagination from "../../../../components/searchFormComponents/results/Pagination";

const fetchPage = jest.fn();

describe("Pagination", () => {
  afterEach(() => {
    fetchPage.mockReset();
  });

  it("should render correctly with correct props", () => {
    const wrapper = mount(
      <MockedProvider>
        <Pagination
          fetchPage={fetchPage}
          itemsOnCurrentPage={100}
          itemsPerPage={100}
          itemsTotal={201}
          startIndex={0}
        />
      </MockedProvider>
    );
    expect(toJson(wrapper)).toMatchSnapshot();

    const wrapper2 = mount(
      <MockedProvider>
        <Pagination
          fetchPage={fetchPage}
          itemsOnCurrentPage={10}
          itemsPerPage={10}
          itemsTotal={201}
          startIndex={10}
        />
      </MockedProvider>
    );
    expect(toJson(wrapper2)).toMatchSnapshot();

    const wrapper3 = mount(
      <MockedProvider>
        <Pagination
          fetchPage={fetchPage}
          itemsOnCurrentPage={1000}
          itemsPerPage={1000}
          itemsTotal={201}
          startIndex={0}
        />
      </MockedProvider>
    );
    expect(toJson(wrapper3)).toMatchSnapshot();
  });

  it("should enable previous button when there is previous data", () => {
    const wrapper = mount(
      <MockedProvider>
        <Pagination
          fetchPage={fetchPage}
          itemsOnCurrentPage={10}
          itemsPerPage={10}
          itemsTotal={201}
          startIndex={11}
        />
      </MockedProvider>
    );
    expect(
      wrapper
        .find('button[data-test="pagination-previous"]')
        .first()
        .prop("disabled")
    ).toBeFalsy();
  });

  it("should disable previous button when no previous data", () => {
    const wrapper = mount(
      <MockedProvider>
        <Pagination
          fetchPage={fetchPage}
          itemsOnCurrentPage={100}
          itemsPerPage={100}
          itemsTotal={201}
          startIndex={0}
        />
      </MockedProvider>
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
      <MockedProvider>
        <Pagination
          fetchPage={fetchPage}
          itemsOnCurrentPage={100}
          itemsPerPage={100}
          itemsTotal={201}
          startIndex={0}
        />
      </MockedProvider>
    );
    expect(
      wrapper
        .find('button[data-test="pagination-next"]')
        .first()
        .prop("disabled")
    ).toBeFalsy();
  });

  it("should disable next button when there is no next data", () => {
    const wrapper = mount(
      <MockedProvider>
        <Pagination
          fetchPage={fetchPage}
          itemsOnCurrentPage={100}
          itemsPerPage={100}
          itemsTotal={100}
          startIndex={0}
        />
      </MockedProvider>
    );
    expect(
      wrapper
        .find('button[data-test="pagination-next"]')
        .first()
        .prop("disabled")
    ).toBeTruthy();
  });

  it("should disable both next and previous button when there is no next and previous data", () => {
    const wrapper = mount(
      <MockedProvider>
        <Pagination
          fetchPage={fetchPage}
          itemsOnCurrentPage={100}
          itemsPerPage={100}
          itemsTotal={100}
          startIndex={0}
        />
      </MockedProvider>
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
      <MockedProvider>
        <Pagination
          fetchPage={fetchPage}
          itemsOnCurrentPage={100}
          itemsPerPage={10}
          itemsTotal={100}
          startIndex={11}
        />
      </MockedProvider>
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

  it("should call fetchPage with 'PREVIOUS' when previous button is clicked", () => {
    const wrapper = mount(
      <MockedProvider>
        <Pagination
          fetchPage={fetchPage}
          itemsOnCurrentPage={100}
          itemsPerPage={10}
          itemsTotal={100}
          startIndex={10}
        />
      </MockedProvider>
    );

    const previousButton = wrapper
      .find('button[data-test="pagination-previous"]')
      .first();
    previousButton.simulate("click");
    expect(fetchPage).toHaveBeenCalledWith(0, 10, "PREVIOUS");
  });

  it("should call fetchPage with 'NEXT' when next button is clicked", () => {
    const wrapper = mount(
      <MockedProvider>
        <Pagination
          fetchPage={fetchPage}
          itemsOnCurrentPage={10}
          itemsPerPage={10}
          itemsTotal={100}
          startIndex={10}
        />
      </MockedProvider>
    );

    const previousButton = wrapper
      .find('button[data-test="pagination-next"]')
      .first();
    previousButton.simulate("click");
    expect(fetchPage).toHaveBeenCalledWith(20, 10, "NEXT");
  });
});
