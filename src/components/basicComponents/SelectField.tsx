import * as React from "react";

interface ISelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

/**
 * A select field in a form. The actual select is enclosed in a div element
 * with a "control" and a "select" class (as used in Bulma forms). Class
 * names passed to tghis elemebt are applied to this div element.
 *
 * You can pass the same properties as you may to a select component.
 */
const SelectField = (props: ISelectProps) => {
  const { className, children, ...rest } = props;
  return (
    <div className={`control select ${className || ""}`}>
      <select {...rest}>{children}</select>
    </div>
  );
};

export default SelectField;

/**
 * The "any" option. The key attribute has the value "any" and the value
 * attribute has the value "".
 */
export const AnyOption = () => (
  <option key="all" value="All">
    Any
  </option>
);
