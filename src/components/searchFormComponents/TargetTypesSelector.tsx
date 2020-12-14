import * as React from "react";
import styled from "styled-components";
import {
  GALAXY,
  ISM,
  SOLAR_SYSTEM_BODY,
  STAR,
  TargetType,
} from "../../utils/TargetType";
import { Span } from "../basicComponents/Grids";
import { LargeCheckbox } from "../basicComponents/LargeCheckbox";

interface ITargetTypesSelectorProps {
  onChange: (targetTypes: Set<TargetType>) => void;
  targetTypes: Set<TargetType>;
}

const TargetTypesDiv = styled.div`
  && {
    margin-top: 5px;
  }

  label {
    padding-right: 10px;
  }
`;

/**
 * A component for selecting target types.
 *
 * The component does not keep internal state, so it is up to the parent
 * component to ensure that the target types passed as a property remain
 * up-to-date.
 *
 * Properties:
 * -----------
 * targetTypes:
 *     The selected target types.
 * onChange:
 *     The function to call when the user selects or unselects a target type,
 *     which should take the selected target types as its single argument.
 */
export default class TargetTypesSelector extends React.Component<ITargetTypesSelectorProps> {
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTargetTypes = new Set<TargetType>(this.props.targetTypes);
    if (e.target.checked) {
      updatedTargetTypes.add(e.target.value as TargetType);
    } else {
      updatedTargetTypes.delete(e.target.value as TargetType);
    }

    this.props.onChange(updatedTargetTypes);
  };

  render() {
    const { targetTypes } = this.props;

    return (
      <TargetTypesDiv>
        <label>
          <label>
            <Span>
              <LargeCheckbox
                checked={targetTypes.has(GALAXY)}
                data-test="galaxy"
                onChange={this.onChange}
                value={GALAXY}
              />
            </Span>
            Galaxy
          </label>
        </label>
        <label>
          <Span>
            <LargeCheckbox
              checked={targetTypes.has(ISM)}
              data-test="ism"
              onChange={this.onChange}
              value={ISM}
            />
          </Span>
          ISM
        </label>
        <label>
          <Span>
            <LargeCheckbox
              checked={targetTypes.has(SOLAR_SYSTEM_BODY)}
              data-test="solar-system-body"
              onChange={this.onChange}
              value={SOLAR_SYSTEM_BODY}
            />
          </Span>
          Solar System Body
        </label>
        <label>
          <Span>
            <LargeCheckbox
              checked={targetTypes.has(STAR)}
              data-test="star"
              onChange={this.onChange}
              value={STAR}
            />
          </Span>
          Star
        </label>
      </TargetTypesDiv>
    );
  }
}
