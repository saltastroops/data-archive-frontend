import * as React from "react";

interface IDASelectProps {
  className?: string;
  name?: string;
  options: string[];
  onChange?: (e: React.FormEvent<HTMLSelectElement>) => void;
  value?: string;
}

const SelectField = (props: IDASelectProps) => {
  const { options, name, onChange, value, className } = props;
  return (
    <div className={`control  select ${className}`}>
      <select id={`${name}`} onChange={onChange} value={value} name={name}>
        {options.map(option => {
          return <option key={option}>{option}</option>;
        })}
      </select>
    </div>
  );
};

export default SelectField;
