jest.mock("../../api");

import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import * as React from "react";
import { baseAxiosClient } from "../../api";
import JS9View from "../../components/JS9View";

describe("JS9View", () => {
  (window as any).JS9 = {
    Load: jest.fn(),
    init: jest.fn(),
  };

  const onClose = jest.fn();

  afterEach(() => {
    (window as any).JS9.init.mockReset();
    (window as any).JS9.Load.mockReset();
    onClose.mockReset();
    JS9View.initialisedBefore = false;
  });

  it("should display correctly for open=true", () => {
    const wrapper = mount(<JS9View open={true} fitsURL="" onClose={onClose} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should display correctly for open=false", () => {
    const wrapper = mount(
      <JS9View open={false} fitsURL="" onClose={onClose} />
    );

    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should throw an error if used more than once", () => {
    const f = () =>
      mount(
        <div>
          <JS9View open={false} fitsURL="" onClose={onClose} />
          <JS9View open={false} fitsURL="" onClose={onClose} />
        </div>
      );

    // suppress error messages
    const originalError = console.error;
    console.error = jest.fn();

    expect(f).toThrowError();

    // re-enable error messages
    console.error = originalError;
  });

  it("should throw an error if initialised with a truthy FITS URL", () => {
    const f = () =>
      mount(
        <div>
          <JS9View
            open={false}
            fitsURL="http://some.url.saao.ac.za"
            onClose={onClose}
          />
        </div>
      );

    // suppress error messages
    const originalError = console.error;
    console.error = jest.fn();

    expect(f).toThrowError();

    // re-enable error messages
    console.error = originalError;
  });

  it("should initialize JS9", () => {
    const wrapper = mount(
      <JS9View open={false} fitsURL="" onClose={onClose} />
    );

    expect((window as any).JS9.init).toHaveBeenCalled();
  });

  it("should load a new FITS URL if it is not an empty string", () => {
    const url1 = "http://some.url.saao.ac.za";
    const url2 = "http://some.other.url.saao.ac.za";

    (baseAxiosClient as any).mockImplementation(() => ({
      get: () => ({ data: "image" }),
    }));

    (window as any).JS9.Load.mockReturnValue("image");

    const wrapper = mount(
      <JS9View open={false} fitsURL="" onClose={onClose} />
    );

    try {
      wrapper.setProps({ fitsURL: url1 });
      wrapper.setProps({ fitsURL: url2 });

      expect((window as any).JS9.Load).toHaveBeenCalledTimes(2);
      expect((window as any).JS9.Load).toHaveBeenNthCalledWith(1, url1);
      expect((window as any).JS9.Load).toHaveBeenNthCalledWith(2, url2);
    } catch (e) {
      return;
    }
  });

  it("should not load a new FITS URL if it is an empty string", () => {
    const url1 = "http://some.url.saao.ac.za";

    const wrapper = mount(
      <JS9View open={false} fitsURL="" onClose={onClose} />
    );

    (baseAxiosClient as any).mockImplementation(() => ({
      get: () => ({ data: "image" }),
    }));

    (window as any).JS9.Load.mockReturnValue("image");

    try {
      wrapper.setProps({ fitsURL: url1 });
      wrapper.setProps({ fitsURL: "" });

      expect((window as any).JS9.Load).toHaveBeenCalledTimes(1);
      expect((window as any).JS9.Load).toHaveBeenCalledWith(url1);
    } catch (e) {
      return;
    }
  });

  it("should not load a FITS URL if another property has changed", () => {
    const url1 = "http://some.url.saao.ac.za";

    (baseAxiosClient as any).mockImplementation(() => ({
      get: () => ({ data: "image" }),
    }));

    (window as any).JS9.Load.mockReturnValue("image");

    const wrapper = mount(
      <JS9View open={false} fitsURL="" onClose={onClose} />
    );

    try {
      wrapper.setProps({ fitsURL: "http://some.url.saao.ac.za" });
      expect((window as any).JS9.Load).toHaveBeenCalled();
    } catch (e) {
      return;
    }

    (window as any).JS9.Load.mockReset();

    try {
      wrapper.setProps({ open: true });
      expect((window as any).JS9.Load).not.toHaveBeenCalled();
    } catch (e) {
      return;
    }
  });

  it("should call onClose when the overlay is clicked", () => {
    const wrapper = mount(<JS9View open={true} fitsURL="" onClose={onClose} />);

    // Simulate a click on the overlay
    wrapper.find('div[data-test="overlay"]').simulate("click");

    // The onClose property has been called
    expect(onClose).toHaveBeenCalled();
  });

  it("should close when the close button is clicked", () => {
    const wrapper = mount(<JS9View open={true} fitsURL="" onClose={onClose} />);

    // Simulate a click on the close button
    wrapper.find('button[data-test="close"]').simulate("click");

    // The onClose property has been called
    expect(onClose).toHaveBeenCalled();
  });

  it("should close when the esc key is clicked", () => {
    const wrapper = mount(<JS9View open={true} fitsURL="" onClose={onClose} />);

    // Simulate using the esc key
    wrapper
      .find('div[data-test="overlay"]')
      .simulate("keydown", { keyCode: 27 });

    // The onClose property has been called
    expect(onClose).toHaveBeenCalled();
  });

  it("should not close when a key other than esc is clicked", () => {
    const wrapper = mount(<JS9View open={true} fitsURL="" onClose={onClose} />);

    // Simulate using a key other than esc
    wrapper
      .find('div[data-test="overlay"]')
      .simulate("keydown", { keyCode: 27 });

    // The onClose property has been called
    expect(onClose).toHaveBeenCalled();
  });
});
