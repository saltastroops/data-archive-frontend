import * as React from "react";

interface IDACheckboxProps {
  name: string;
  checked?: string;
  label?: string;
  onChange?: any;
}

const DACheckbox = (props: IDACheckboxProps) => {
  const { label, name } = props;
  return (
    <div className={"field is-horizontal"}>
      <label htmlFor={`${name}+${label}`} className={"tile is-3"}>
        {label}:
      </label>
      <input
        className={"is-checkradio"}
        id={`${name}+${label}`}
        name={name}
        type={"checkbox"}
      />
    </div>
  );
};
// DACheckbox.defaultProps = {
//     options
// }
export default DACheckbox;
