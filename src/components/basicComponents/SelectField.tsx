import * as React from "react";

interface IDASelectProps {
  name?: string;
  options: string[];
  onChange?: (
    e: React.FormEvent<HTMLSelectElement> | React.FormEvent<HTMLInputElement>
  ) => void;
  value?: string;
}

const SelectField = (props: IDASelectProps) => {
  const { options, name, onChange, value } = props;
  return (
    <div className="control  select">
      <select id={`${name}`} onChange={onChange} value={value} name={name}>
        {options.map(option => {
          return <option key={option}>{option}</option>;
        })}
      </select>
    </div>
  );
};

export default SelectField;
