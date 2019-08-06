import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import Modal from "react-responsive-modal";
import styled from "styled-components";
import Message from "./Message";

interface IHelpButtonProps {
  name: string;
  showHelp: (name: string) => void;
}

const HelpButtonContainer = styled.div.attrs({})`
  && {
    margin-top: 7px;
  }
`;

const HelpButton = (props: IHelpButtonProps) => {
  const { name, showHelp } = props;
  return (
    <HelpButtonContainer onClick={() => showHelp(name)} className={"control"}>
      <FontAwesomeIcon icon={faQuestionCircle} />
    </HelpButtonContainer>
  );
};
export default HelpButton;
