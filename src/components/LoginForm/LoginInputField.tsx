import * as React from "react";
import InputField from "../basicComponents/InputField";

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
  error?: string;
  label?: string;
  loading?: boolean;
  name?: string;
  onChange?: any;
  placeholder?: string;
  type?: string;
  value?: string;
}

const LoginInputField = (props: ILoginInputProps) => {
  const { error, label, loading, name, onChange, type, value } = props;
  return (
    <div className={"field"}>
      <label htmlFor={`${name}+${label}`} className={"label"}>
        {label}:
      </label>
      <div className={"control is-child"}>
        <InputField
          data-test="target-name-input"
          disabled={loading}
          name={name}
          value={value || ""}
          error={error}
          onChange={onChange}
          type={type}
        />
      </div>
    </div>
  );
};

export default LoginInputField;
