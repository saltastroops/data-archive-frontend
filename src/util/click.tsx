import { ReactWrapper } from "enzyme";
import * as React from "react";

/**
 * Call the onClick method of the element wrapped in a wrapper with a mouse
 * click event.
 *
 * This function is intended for use in unit tests only. It is required because
 * the standard  Enzyme simulate does not seem to work for routing (see
 * https://github.com/ReactTraining/react-router/issues/4337).
 *
 * Properties
 * ----------
 * wrapper:
 *     Enzyme wrapper, which should wrap exactly one element.
 */
export default function click(
  wrapper: ReactWrapper<any, React.Component, any>
) {
  wrapper.props().onClick(new MouseEvent("click"));
}
