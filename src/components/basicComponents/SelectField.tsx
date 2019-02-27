import * as React from "react";

interface ISelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const SelectField = (props: ISelectProps) => {
  const { className, children, ...rest } = props;
  return (
    <div className={`control select ${className}`}>
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
  <option key="any" value="">
    Any
  </option>
);
