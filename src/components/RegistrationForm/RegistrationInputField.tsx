import * as React from "react";

interface IDAInputProps {
  label?: string;
  name?: string;
  onChange?: any;
  placeholder?: string;
  type?: string;
  value?: string;
}

const RegistrationInputField = (props: IDAInputProps) => {
  const { label, name, onChange, placeholder, type, value } = props;
  return (
    <div className={"field"}>
      <label htmlFor={`${name}+${label}`} className={"label"}>
        {label}:
      </label>
      <div className={"control is-child"}>
        <input
          id={name}
          type={type}
          className={`${name} input`}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default RegistrationInputField;
