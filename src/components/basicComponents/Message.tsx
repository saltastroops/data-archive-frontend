import * as React from "react";

interface IMessage {
  message: string;
  type?: "info" | "warning" | "danger" | "success";
}

const Message = (props: IMessage) => {
  const { message, type } = props;
  return (
    <div className={`notification ${!type ? "" : "is-" + type} `}>
      {message}
    </div>
  );
};
export default Message;
