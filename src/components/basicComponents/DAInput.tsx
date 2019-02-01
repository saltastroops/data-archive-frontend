import * as React from "react";

interface IDAInputProps {
  name?: string;
  value?: string;
  label?: string;
  onChange?: any;
}

const DAInput = (props: IDAInputProps) => {
  const { label, value, onChange } = props;
  return (
    <div className={"field is-horizontal"}>
      <label htmlFor={`${name}+${label}`} className={"tile is-3"}>
        {label}:
      </label>
      <div className={"control is-child"}>
        <input
          id={`${name}+${label}`}
          type={"text"}
          className={"is-label input"}
          name={"text"}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
export default DAInput;
