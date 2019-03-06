import * as React from "react";
import InputField from "../basicComponents/InputField";

interface IRegistrationInputProps {
  error?: string;
  label?: string;
  loading?: boolean;
  name?: string;
  onChange?: any;
  placeholder?: string;
  type?: string;
  value?: string;
}

const RegistrationInputField = (props: IRegistrationInputProps) => {
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

export default RegistrationInputField;
