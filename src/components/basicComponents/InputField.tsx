import * as React from "react";

interface IDAInputProps {
  className?: string;
  name?: string | undefined;
  value?: string | undefined;
  error?: string | undefined;
  loading?: boolean | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string | undefined;
}

const InputField = (props: IDAInputProps) => {
  const {
    className,
    value,
    onChange,
    error,
    name,
    placeholder,
    loading
  } = props;
  return (
    <div className="control">
      <input
        disabled={loading}
        title={error}
        id={`${name}`}
        type={"text"}
        className={`is-label input ${className} ${error &&
          error !== "" &&
          "is-danger"}`}
        name={`${name}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <p style={{ color: "red" }}>{error}</p>
    </div>
  );
};
export default InputField;
