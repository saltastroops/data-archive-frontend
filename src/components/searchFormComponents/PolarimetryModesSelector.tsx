import * as React from "react";
import styled from "styled-components";
import { RSSPolarimetryMode } from "../../utils/ObservationQueryParameters";
import { LargeCheckbox } from "../basicComponents/LargeCheckbox";

interface IPolarimetryModesSelectorProps {
  onChange: (polarimetryModes: Set<RSSPolarimetryMode>) => void;
  polarimetryModes?: Set<RSSPolarimetryMode>;
}

const PolarimetryModesDiv = styled.div`
  && {
    margin-top: 5px;
  }

  label {
    padding-right: 10px;
  }
`;

/**
 * A component for polarimetry modes.
 *
 * The component does not keep internal state, so it is up to the parent
 * component to ensure that the polarimetry modes passed as a property remain
 * up-to-date.
 *
 * Properties:
 * -----------
 * polarimetryModes:
 *     The selected polarimetry modes.
 * onChange:
 *     The function to call when the user selects or unselects a polarimetry
 *     mode, which should take the selected target types as its single
 *     argument.
 */
export default class PolarimetryModesSelector extends React.Component<
  IPolarimetryModesSelectorProps
> {
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const polarimetryModes =
      this.props.polarimetryModes || new Set<RSSPolarimetryMode>();
    const updatedPolarimetryModes = new Set<RSSPolarimetryMode>(
      polarimetryModes
    );
    if (e.target.checked) {
      updatedPolarimetryModes.add(e.target.value as RSSPolarimetryMode);
    } else {
      updatedPolarimetryModes.delete(e.target.value as RSSPolarimetryMode);
    }

    this.props.onChange(updatedPolarimetryModes);
  };

  render() {
    const polarimetryModes =
      this.props.polarimetryModes || new Set<RSSPolarimetryMode>();

    return (
      <PolarimetryModesDiv>
        <label>
          <LargeCheckbox
            checked={polarimetryModes.has("Linear")}
            data-test="linear"
            onChange={this.onChange}
            value={"Linear"}
          />
          Linear
        </label>
        <label>
          <LargeCheckbox
            checked={polarimetryModes.has("Linear Hi")}
            data-test="linear-hi"
            onChange={this.onChange}
            value={"Linear Hi"}
          />
          Linear Hi
        </label>
        <label>
          <LargeCheckbox
            checked={polarimetryModes.has("Circular")}
            data-test="circular"
            onChange={this.onChange}
            value={"Circular"}
          />
          Circular
        </label>
        <label>
          <LargeCheckbox
            checked={polarimetryModes.has("All Stokes")}
            data-test="all-stokes"
            onChange={this.onChange}
            value={"All Stokes"}
          />
          All Stokes
        </label>
      </PolarimetryModesDiv>
    );
  }
}
