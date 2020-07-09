import * as React from "react";
import styled from "styled-components";

interface IInfoMessageProps {
  message: string;
}

const InfoMessageContainer = styled.div<{}>`
  color: #b5b5b5
  text-align: center;
`;

const InfoMessage = (props: IInfoMessageProps) => {
  const { message } = props;
  return <InfoMessageContainer>{message}</InfoMessageContainer>;
};
export default InfoMessage;
