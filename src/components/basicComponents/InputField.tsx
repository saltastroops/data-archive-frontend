import * as React from "react";
import styled from "styled-components";
import { type } from "os";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  type?: string;
}

/**
 * A paragraph with an error message.
 */
const Error = styled.p.attrs({
  className: "has-text-danger"
})``;

/**
 * An input field with an error message underneath it.
 *
 * The field accepts all attributes you can pass to an HTML input element. In
 * addition, you may pass an error argument with an error message to display.
 */
const InputField = (props: IInputProps) => {
  const { className, error, type, ...rest } = props;
  return (
    <div className="control">
      <input
        type={type}
        className={`input ${className} ${error && error !== "" && "is-danger"}`}
        {...rest}
      />
      {error && <Error>{error}</Error>}
    </div>
  );
};
export default InputField;
