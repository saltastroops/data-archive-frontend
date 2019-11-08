import * as React from "react";
import styled from "styled-components";

interface ISelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const MultiSelectContainer = styled.div<{ className: string }>`
  width: 95%;
`;

/**
 * A select field in a form. The actual select is enclosed in a div element
 * with a "control" and a "select" class (as used in Bulma forms). Class
 * names passed to tghis elemebt are applied to this div element.
 *
 * You can pass the same properties as you may to a select component.
 */
const MultiSelectField = (props: ISelectProps) => {
  const { className, children, ...rest } = props;
  return (
    <MultiSelectContainer
      className={`control select is-multiple ${className || ""}`}
    >
      <select multiple={true} size={6} {...rest} style={{ width: "216px" }}>
        {children}
      </select>
    </MultiSelectContainer>
  );
};

export default MultiSelectField;

/**
 * The "any" option. The key attribute has the value "any" and the value
 * attribute has the value "".
 */
export const AllOption = () => <option value="All">All</option>;
