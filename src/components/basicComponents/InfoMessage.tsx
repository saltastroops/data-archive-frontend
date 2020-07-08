import * as React from "react";
import styled from "styled-components";

interface IInfoMessageProps {
  message: string;
}

const InfoMessageContainer = styled.div<{}>`
  opacity: 0.5;
  margin-left: 1.7%;
`;

const InfoMessage = (props: IInfoMessageProps) => {
  const { message } = props;
  return (
    <InfoMessageContainer>
      {message.split(/\n/g).map((part: string) => (
        <p key={part}>{part}</p>
      ))}
    </InfoMessageContainer>
  );
};
export default InfoMessage;
