import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons/faQuestionCircle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

interface IHelpButtonProps {
  left?: boolean;
  toolTipMessage: string;
}

const HelpButtonContainer = styled.div.attrs({})`
  && {
    margin-left: 5px;
  }
`;

const HelpMessage = styled.p<{
  className: "notification is-info";
  left: boolean;
}>`
  && {
    display: block;
    margin-left: 5px;
    z-index: 99;
    position: absolute;
    width: 450px;
    opacity: 0.95;
    color: black;
    left: ${props => (props.left ? 0 : -450)}px;
  }
`;

class HelpButton extends React.Component<IHelpButtonProps, any> {
  state = {
    mousePositionX: 0,
    showHelpOf: false
  };
  updateState = (name: boolean) => {
    if (!name) {
      this.setState(() => ({ showHelpOf: false }));
    } else {
      this.setState(() => ({ showHelpOf: true }));
    }
  };
  componentDidMount() {
    document.addEventListener("mousedown", () => {
      this.updateState(false);
    });
  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", () => {
      // do nothing
    });
  }
  render() {
    const { toolTipMessage, left } = this.props;
    const { showHelpOf } = this.state;
    return (
      <HelpButtonContainer
        className={`
          control
      `}
        onClick={() => this.updateState(true)}
        data-tooltip={toolTipMessage}
      >
        <FontAwesomeIcon icon={faQuestionCircle} />
        {showHelpOf && (
          <HelpMessage className={"notification is-info"} left={left || false}>
            {toolTipMessage}
          </HelpMessage>
        )}
      </HelpButtonContainer>
    );
  }
}
export default HelpButton;
