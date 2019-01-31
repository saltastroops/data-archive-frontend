import * as React from "react";

interface IDASelectProps {
  name?: string;
  options: string[];
  label?: string;
  onChange?: any;
}

const DASelect = (props: IDASelectProps) => {
  const { label, options } = props;
  return (
    <div className={"field is-horizontal"}>
      <label htmlFor={`${name}+${label}`} className={"tile is-3"}>
        {label}:
      </label>
      <div className={"control  select"}>
        <select id={`${name}+${label}`}>
          {options.map(option => {
            return <option key={option}>{option}</option>;
          })}
        </select>
      </div>
    </div>
  );
};
// DASelect.defaultProps = {
//     options
// }
export default DASelect;
