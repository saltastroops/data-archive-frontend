import * as React from "react";

interface IMessageProps {
  message: string;
  type?: "info" | "warning" | "danger" | "success";
}

// Most uses of this component can be improved I feel not to document this properly since
// now it is a place holder for real component.
// No test will be done on it as well for the above reason

const Message = (props: IMessageProps) => {
  const { message, type } = props;
  return (
    <div className={`notification ${!type ? "" : "is-" + type} `}>
      {message.split(/\n/g).map((part: string) => (
        <p key={part}>{part}</p>
      ))}
    </div>
  );
};
export default Message;
