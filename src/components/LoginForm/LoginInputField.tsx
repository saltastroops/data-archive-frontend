import * as React from "react";

/*
The login input field responsible for user input.

Properties:
-----------
label
  The label which detail the user input field
name
  The name that uniquecly identifies the input field
onChange
  The fuction that is responsible for updating the input field value when changed
placeholder
  It gives an example of the required value
type
  The type of the input field e.g. text, password, etc.
value
  The value of the input field
*/

interface ILoginInputProps {
  label?: string;
  name?: string;
  onChange?: any;
  placeholder?: string;
  type?: string;
  value?: string;
}

const LoginInputField = (props: ILoginInputProps) => {
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

export default LoginInputField;
